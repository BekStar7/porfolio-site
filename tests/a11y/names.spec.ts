import { expect, test } from '@playwright/test'
import { DESKTOP, LOCALES, MOBILE, THEMES, VIEWPORTS, localeByCode } from '../support/surfaces'
import { openSurface } from '../support/harness'
import {
  FOCUSABLE_SELECTOR,
  INTERACTIVE_ROLES,
  ariaNodeOf,
  ariaTree,
  describeElement,
  flattenAria,
} from '../support/aria'
import { messages } from '../support/messages'

/**
 * Доступное имя — единственное, что скринридер сообщает про управляющий
 * элемент. Все проверки ниже спрашивают имя у дерева доступности, а не у
 * `textContent`: у иконочной кнопки текста нет вовсе, а подпись лежит
 * в `.sr-only`.
 */

for (const locale of LOCALES) {
  for (const viewport of VIEWPORTS) {
    const surface = { locale, theme: 'light' as const, viewport }

    test.describe(`accessible names · ${locale.code} · ${viewport.name}`, () => {
      test.use({ locale: locale.language })

      test('every interactive control has a non-empty name', async ({ page, baseURL }) => {
        await openSurface(page, surface, baseURL!)

        const controls = page.locator(FOCUSABLE_SELECTOR)
        const total = await controls.count()
        expect(total, 'no focusable controls found — is the page rendered?').toBeGreaterThan(0)

        const unnamed: string[] = []
        let checked = 0

        for (let index = 0; index < total; index++) {
          const control = controls.nth(index)
          // Скрытые элементы недостижимы и с клавиатуры: на мобильной ширине
          // это ссылки свёрнутого меню, на широкой — кнопка-бургер.
          if (!await control.isVisible()) continue

          checked++
          const node = await ariaNodeOf(control)

          if (!node || !INTERACTIVE_ROLES.includes(node.role) || !node.name?.trim()) {
            unnamed.push(`${node?.role ?? 'absent'} "${node?.name ?? ''}" — ${await describeElement(control)}`)
          }
        }

        expect(checked, 'every visible control was skipped — the query is wrong').toBeGreaterThan(0)
        expect(unnamed, 'controls without an accessible name').toEqual([])
      })

      test('icon-only controls are named too', async ({ page, baseURL }) => {
        await openSurface(page, surface, baseURL!)

        // Ровно те элементы, у которых нет видимого текста: имя может прийти
        // только из `.sr-only`. Бургер существует лишь на узкой ширине.
        const iconOnly = viewport.headerCollapsed
          ? ['.theme-toggle', '.header__burger']
          : ['.theme-toggle']

        for (const selector of iconOnly) {
          const control = page.locator(selector)
          await expect(control).toBeVisible()

          const node = await ariaNodeOf(control)
          expect(node?.name?.trim(), `${selector} has no accessible name`).toBeTruthy()
        }
      })
    })
  }
}

/**
 * 4.4 — ниже 62rem `.header__name` скрыт визуально (clip-path), а не
 * `display: none`. Разница невидима глазом и решающая для скринридера:
 * `display: none` выбросил бы текст из дерева, и ссылка-логотип осталась бы
 * без имени — внутри неё только `aria-hidden` монограмма.
 */
for (const locale of LOCALES) {
  test.describe(`brand link name · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('survives the collapsed header', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: MOBILE }, baseURL!)

      const name = page.locator('.header__name')

      // Текст берём из самой разметки намеренно: `textContent` виден даже у
      // элемента с `display: none`, а доступное имя — нет. Именно на этом
      // расхождении тест и ловит подмену clip-path на display:none.
      const expected = (await name.textContent())?.trim()
      expect(expected, '.header__name must carry the name in markup').toBeTruthy()

      await expect(name).toBeAttached()
      await expect(name).not.toHaveCSS('display', 'none')
      await expect(name).not.toHaveCSS('visibility', 'hidden')

      const brand = await ariaNodeOf(page.locator('.header__brand'))
      expect(brand?.name, 'the brand link must still announce whose site this is')
        .toContain(expected!)
    })

    test('is plainly visible above the breakpoint', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      await expect(page.locator('.header__name')).toBeVisible()
    })
  })
}

/**
 * 4.5 — обе подписи переключателя темы всегда есть в разметке, лишнюю убирает
 * CSS. Если убирать её не `display: none`, а, скажем, прозрачностью, обе
 * попадут в дерево, и скринридер прочитает противоречие: «включить светлую»
 * и «включить тёмную» одновременно.
 */
for (const theme of THEMES) {
  const locale = localeByCode('ru')

  test.describe(`theme toggle name · ${theme}`, () => {
    test.use({ locale: locale.language })

    test('announces exactly the action for the active theme', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme, viewport: DESKTOP }, baseURL!)

      const both = [messages(locale).theme.toLight, messages(locale).theme.toDark]
      // В светлой теме доступно действие «включить тёмную», и наоборот.
      const expected = theme === 'light' ? messages(locale).theme.toDark : messages(locale).theme.toLight
      const unexpected = both.find(label => label !== expected)!

      const node = await ariaNodeOf(page.locator('.theme-toggle'))
      const name = node?.name ?? ''

      expect(name, `in the ${theme} theme the toggle must offer the other theme`).toContain(expected)
      expect(name, 'the inactive label must stay out of the accessibility tree')
        .not.toContain(unexpected)
    })
  })
}

/**
 * 4.6 — внешняя ссылка уводит со страницы. Зрячий пользователь видит иконку;
 * скринридеру об этом должно сказать имя. `rel` здесь не про удобство, а про
 * то, что открытая вкладка не получит доступ к `window.opener`.
 */
for (const locale of LOCALES) {
  test.describe(`external links · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('announce the new tab and withhold the opener', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      const external = page.locator('a[target="_blank"]')
      const total = await external.count()
      expect(total, 'the profile has external links — none were found').toBeGreaterThan(0)

      const phrase = messages(locale).a11y.opensInNewTab
      const problems: string[] = []

      for (let index = 0; index < total; index++) {
        const link = external.nth(index)
        const rel = (await link.getAttribute('rel')) ?? ''
        const tokens = rel.split(/\s+/)
        const node = await ariaNodeOf(link)

        if (!tokens.includes('noopener') || !tokens.includes('noreferrer')) {
          problems.push(`rel="${rel}" — ${await describeElement(link)}`)
        }
        if (!node?.name?.includes(phrase)) {
          problems.push(`name "${node?.name ?? ''}" omits "${phrase}"`)
        }
      }

      expect(problems, 'external links must announce the new tab and set rel').toEqual([])
    })
  })
}

/**
 * 6.5 — WCAG 2.5.3 Label in Name: голосовой ввод произносит видимый текст
 * ссылки, и он должен входить в её доступное имя. Имя («Наверх, к началу
 * страницы») уточняет видимый текст («Наверх»), но не заменяет его.
 */
for (const locale of LOCALES) {
  test.describe(`back-to-top link name · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('accessible name contains the visible text', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      const link = page.locator('.footer__top')
      await link.scrollIntoViewIfNeeded()

      const visible = messages(locale).nav.top
      const node = await ariaNodeOf(link)

      expect(node?.name?.toLowerCase(), 'the accessible name must contain the visible label')
        .toContain(visible.toLowerCase())
    })
  })
}

/**
 * 4.7 — иконки и полоска владения языком ничего не добавляют к тексту рядом.
 * В дереве доступности их быть не должно: иначе скринридер читает одно и то
 * же дважды, а по полоске вообще нечего прочитать.
 */
for (const viewport of VIEWPORTS) {
  const locale = localeByCode('ru')

  test.describe(`decorative content · ${viewport.name}`, () => {
    test.use({ locale: locale.language })

    test('stays out of the accessibility tree and out of tab order', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport }, baseURL!)

      const icons = page.locator('svg.icon')
      expect(await icons.count(), 'no icons found — the check would be vacuous')
        .toBeGreaterThan(0)

      // Ни одной графической роли в дереве: значит, ни одна иконка не
      // объявлена как изображение.
      const graphical = [...new Set(flattenAria(await ariaTree(page)).map(node => node.role))]
        .filter(role => role === 'img' || role === 'image' || role.startsWith('graphics'))
      expect(graphical, 'decorative graphics must not be exposed').toEqual([])

      // Каждая иконка помечена скрытой и невыводима из фокуса: в SVG за это
      // отвечает focusable="false", иначе IE-подобное поведение делает её
      // остановкой табуляции.
      const count = await icons.count()
      for (let index = 0; index < count; index++) {
        const icon = icons.nth(index)
        await expect(icon).toHaveAttribute('aria-hidden', 'true')
        await expect(icon).toHaveAttribute('focusable', 'false')
      }
      await expect(page.locator('svg[tabindex]')).toHaveCount(0)

      const meters = page.locator('.language__meter')
      expect(await meters.count(), 'no language meters found').toBeGreaterThan(0)
      const meterCount = await meters.count()
      for (let index = 0; index < meterCount; index++) {
        await expect(meters.nth(index)).toHaveAttribute('aria-hidden', 'true')
      }
    })
  })
}
