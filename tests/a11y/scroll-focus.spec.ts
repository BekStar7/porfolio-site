import { expect, test } from '@playwright/test'
import { DESKTOP, LOCALES } from '../support/surfaces'
import { headerBox, intersects, openSurface, waitForScrollToSettle } from '../support/harness'
import { projectCards, siteNavLink } from '../support/locators'

const NAV_IDS = ['about', 'experience', 'projects', 'skills', 'contact'] as const

/**
 * 6.2 — Шапка залипает поверх контента. Когда браузер сам прокручивает
 * страницу, чтобы показать элемент, получивший фокус с клавиатуры (стандартное
 * поведение фокуса, не наша прокрутка), он не знает про шапку и может
 * поставить элемент прямо под ней. `scroll-padding-top` на прокручиваемом
 * контейнере — единственное место, которое браузер учитывает для любого
 * автоскролла к фокусу, а не только для явных переходов по якорю.
 */
for (const locale of LOCALES) {
  test.describe(`focus not obscured by sticky header · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('keyboard focus on an offscreen control scrolls clear of the sticky header', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      // Хромиум решает, как именно скроллить к элементу, получившему фокус,
      // в зависимости от того, насколько тот сейчас скрыт: если элемент лишь
      // слегка обрезан сверху окном просмотра, браузер делает минимальную
      // прокрутку и ставит его верхний край вровень с верхом окна — то есть
      // прямо под залипающую шапку. (Если элемент целиком вне экрана,
      // браузер вместо этого центрирует его — тот случай шапку не задевает,
      // поэтому здесь важно воспроизвести именно частичную обрезку.)
      const target = projectCards(page, locale).first().getByRole('link').first()
      const natural = await target.boundingBox()
      if (!natural) throw new Error('the target element has no bounding box')

      await page.evaluate(y => window.scrollTo(0, y), natural.y + 40)
      await waitForScrollToSettle(page)

      await target.focus()
      await waitForScrollToSettle(page)

      const focused = await target.boundingBox()
      if (!focused) throw new Error('the focused element has no bounding box')
      const header = await headerBox(page)

      expect(
        intersects(focused, header),
        'the focused control must not be hidden behind the sticky header after the browser auto-scrolls it into view',
      ).toBe(false)
    })
  })
}

/**
 * 6.3 — `scroll-padding-top` (6.1) и `.section`'s `scroll-margin-top`
 * складываются на переходе по якорю. Проверяем, что сумма не утапливает
 * заголовок раздела заново под шапку с другой стороны.
 */
for (const locale of LOCALES) {
  test.describe(`in-page anchor landing · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    for (const id of NAV_IDS) {
      test(`"${id}" heading lands visible and clear of the header`, async ({ page, baseURL }) => {
        await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

        await siteNavLink(page, locale, id).click()
        await waitForScrollToSettle(page)

        const heading = page.locator(`#${id}-title`)
        await expect(heading).toBeVisible()

        const box = await heading.boundingBox()
        if (!box) throw new Error(`heading #${id}-title has no bounding box`)
        const header = await headerBox(page)

        expect(
          intersects(box, header),
          `the "${id}" section heading must not land underneath the sticky header`,
        ).toBe(false)
      })
    }
  })
}
