import { expect, test } from '@playwright/test'
import { DESKTOP, LOCALES, MOBILE, VIEWPORTS, localeByCode } from '../support/surfaces'
import { FOCUSABLE_SELECTOR } from '../support/aria'
import { openSurface } from '../support/harness'
import { menuButton, siteMenu, siteNavLinks, skipLink as skipLinkOf, themeToggle } from '../support/locators'
import { messages } from '../support/messages'

/**
 * 5.1 — Skip-ссылка должна быть первой в табуляции, становиться видимой по
 * фокусу и переносить фокус в `<main>`: только так следующий Tab продолжит
 * путь после контента, а не после шапки — `<main>` в разметке идёт раньше.
 */
for (const locale of LOCALES) {
  test.describe(`skip link · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('is first in tab order, becomes visible on focus, and moves focus into main', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      await page.keyboard.press('Tab')
      const skipLink = skipLinkOf(page, locale)
      await expect(skipLink).toBeFocused()

      // Появление анимировано (`transition: transform`) — ждём конца, а не
      // измеряем середину движения.
      await expect.poll(
        async () => (await skipLink.boundingBox())?.y,
        { message: 'skip link must move into the viewport once focused' },
      ).toBeGreaterThanOrEqual(0)

      await page.keyboard.press('Enter')
      const activeId = await page.evaluate(() => document.activeElement?.id)
      expect(activeId, 'activating the skip link must focus #main').toBe('main')

      await page.keyboard.press('Tab')
      const insideHeader = await page.evaluate(() => !!document.activeElement?.closest('header'))
      expect(insideHeader, 'the next Tab after the skip link must not land back inside the header').toBe(false)
    })
  })
}

/**
 * 5.2 — Прямой обход клавиатурой должен достать каждый видимый интерактивный
 * элемент ровно по одному разу, в порядке документа (совпадает с визуальным
 * порядком: макет однокапоночный, без переопределения `order`). Ни у одного
 * элемента не должно быть положительного `tabindex` — он ломает естественный
 * порядок для всех, у кого его нет.
 */
for (const viewport of VIEWPORTS) {
  const locale = localeByCode('ru')

  test.describe(`forward traversal · ${viewport.name}`, () => {
    test.use({ locale: locale.language })

    test('reaches every visible control once, in document order, without a trap', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport }, baseURL!)

      const positiveTabindex = await page.$$eval('[tabindex]', els =>
        els
          .map(el => Number(el.getAttribute('tabindex')))
          .filter(value => value > 0),
      )
      expect(positiveTabindex, 'no element may declare a positive tabindex').toEqual([])

      const total = await page.$$eval(FOCUSABLE_SELECTOR, (els) => {
        const visible = els.filter(el => !!(el as HTMLElement).offsetWidth || !!(el as HTMLElement).offsetHeight || el.getClientRects().length > 0)
        visible.forEach((el, index) => el.setAttribute('data-tab-order', String(index)))
        return visible.length
      })
      expect(total, 'no focusable controls found — is the page rendered?').toBeGreaterThan(0)

      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())

      for (let index = 0; index < total; index++) {
        await page.keyboard.press('Tab')
        const order = await page.evaluate(() => document.activeElement?.getAttribute('data-tab-order'))
        expect(order, `Tab ${index + 1} did not land on the expected control — trapped or skipped`).toBe(String(index))
      }
    })
  })
}

/**
 * 5.3 — Фокус с клавиатуры должен быть виден в любой теме. Тест специально
 * опрашивает вычисленный `outline`, а не полагается на скриншот.
 */
for (const theme of ['light', 'dark'] as const) {
  const locale = localeByCode('ru')

  test.describe(`focus indicator · ${theme}`, () => {
    test.use({ locale: locale.language })

    test('is visible on a keyboard-focused control', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme, viewport: DESKTOP }, baseURL!)

      const control = themeToggle(page, locale)
      await control.focus()

      const outline = await control.evaluate((el) => {
        const style = getComputedStyle(el)
        return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
      })

      expect(outline.style, 'focused control must declare a visible outline style').not.toBe('none')
      expect(outline.width, 'focused control outline must have non-zero width').toBeGreaterThan(0)
    })
  })
}

/**
 * 5.4 — Цикл раскрытия мобильного меню: `aria-expanded` до/после, `aria-controls`
 * указывает на само меню, Escape сворачивает и возвращает фокус на кнопку,
 * а переход по ссылке тоже сворачивает меню.
 */
for (const locale of LOCALES) {
  test.describe(`mobile menu disclosure · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('expands, collapses on Escape with focus return, and collapses on link activation', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: MOBILE }, baseURL!)

      const burger = menuButton(page)
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
      await expect(burger).toHaveAttribute('aria-controls', 'site-menu')

      await burger.click()
      await expect(burger).toHaveAttribute('aria-expanded', 'true')
      await expect(siteMenu(page)).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
      await expect(burger).toBeFocused()

      await burger.click()
      await expect(burger).toHaveAttribute('aria-expanded', 'true')

      await siteNavLinks(page, locale).first().click()
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
    })
  })
}

/**
 * 6.9 — Меню сворачивается, когда внимание ушло за его пределы: клик вне
 * меню и кнопки, либо смена маршрута. Меню не модальное, поэтому фокус при
 * открытии не переносим внутрь и ловушку не ставим.
 */
for (const locale of LOCALES) {
  test.describe(`mobile menu dismissal · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('does not move focus into the menu on open', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: MOBILE }, baseURL!)

      const burger = menuButton(page)
      await burger.focus()
      await page.keyboard.press('Enter')
      await expect(burger).toHaveAttribute('aria-expanded', 'true')
      await expect(burger).toBeFocused()
    })

    test('collapses on pointer interaction outside the menu and its trigger', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: MOBILE }, baseURL!)

      const burger = menuButton(page)
      await burger.click()
      await expect(burger).toHaveAttribute('aria-expanded', 'true')

      // Клик внутри меню, но не по ссылке, меню не закрывает
      const menu = siteMenu(page)
      const box = (await menu.boundingBox())!
      await page.mouse.click(box.x + 2, box.y + 2)
      await expect(burger).toHaveAttribute('aria-expanded', 'true')

      // Клик по содержимому страницы под меню
      await page.mouse.click(MOBILE.width / 2, MOBILE.height - 20)
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
      await expect(menu).toBeHidden()
    })

    test('collapses when the active route changes', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: MOBILE }, baseURL!)

      const burger = menuButton(page)
      await burger.click()
      await expect(burger).toHaveAttribute('aria-expanded', 'true')

      // Переход через роутер, а не кликом: pointerdown не должен участвовать,
      // иначе тест не отличит закрытие по маршруту от закрытия по клику.
      const target = locale.code === 'ru' ? '/en' : '/'
      await page.evaluate((path) => {
        const app = (document.querySelector('#__nuxt') as unknown as { __vue_app__: { config: { globalProperties: { $router: { push: (p: string) => Promise<void> } } } } }).__vue_app__
        return app.config.globalProperties.$router.push(path)
      }, target)

      await page.waitForFunction((path) => location.pathname === path, target)
      await expect(burger).toHaveAttribute('aria-expanded', 'false')
    })
  })
}

/**
 * 5.5 — Свёрнутое меню не должно быть ни в табуляции, ни в дереве
 * доступности: `display: none` решает оба свойства разом. Симметрично,
 * бургера не должно быть выше точки перелома.
 */
for (const viewport of VIEWPORTS) {
  const locale = localeByCode('ru')

  test.describe(`collapsed menu reachability · ${viewport.name}`, () => {
    test.use({ locale: locale.language })

    test('menu links are unreachable below the breakpoint; the burger is absent above it', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport }, baseURL!)

      if (viewport.headerCollapsed) {
        await expect(siteNavLinks(page, locale).first()).toBeHidden()
        const focusableLinks = await siteNavLinks(page, locale).evaluateAll(els =>
          els.filter(el => !!(el as HTMLElement).offsetWidth || !!(el as HTMLElement).offsetHeight).length,
        )
        expect(focusableLinks, 'collapsed menu links must not be focusable').toBe(0)
      }
      else {
        await expect(menuButton(page)).toBeHidden()
      }
    })
  })
}

/**
 * 5.6 — Копирование почты объявляется через вежливую живую область, а не
 * только сменой подписи кнопки: незрячему пользователю иначе не узнать,
 * что клик сработал. Фокус остаётся на кнопке — фокус скринридера не дёргает.
 */
for (const locale of LOCALES) {
  test.describe(`copy-email announcement · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('announces confirmation through the live region without moving focus', async ({ page, baseURL, context }) => {
      await context.grantPermissions(['clipboard-write'], { origin: baseURL })
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      const region = page.locator('[role="status"][aria-live="polite"]')
      await expect(region).toHaveCount(1)
      expect((await region.textContent())?.trim(), 'the live region must be empty on load').toBe('')

      const copyLabel = messages(locale).contact.copy
      const copiedLabel = messages(locale).contact.copied
      const button = page.getByRole('button', { name: copyLabel })

      await button.click()
      await expect(region).toHaveText(copiedLabel)
      await expect(button).toBeFocused()
    })
  })
}
