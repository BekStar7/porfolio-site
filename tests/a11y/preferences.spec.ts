import { expect, test } from '@playwright/test'
import { DESKTOP, localeByCode } from '../support/surfaces'
import { pinLocale, seedTheme, waitForHydration } from '../support/harness'

const locale = localeByCode('ru')

/**
 * 5.9 — `prefers-reduced-motion` должен не только отключать переходы (уже
 * покрыто в CSS), но и делать прокрутку по якорю мгновенной, а не плавной.
 * `forced-colors` не должен стирать границы карточек и рамку фокуса.
 */
test.describe('reduced motion', () => {
  test.use({ locale: locale.language })

  test('suppresses transitions and makes in-page scrolling instant', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    await pinLocale(page.context(), locale, baseURL!)
    await seedTheme(page, 'light')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(locale.path)
    await waitForHydration(page)

    const scrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)
    expect(scrollBehavior, 'reduced motion must force instant scrolling').toBe('auto')

    await page.locator('.header__link[href="#projects"]').click()
    // Плавная прокрутка заняла бы сотни миллисекунд; мгновенная — уже здесь.
    await page.waitForFunction(() => {
      const target = document.getElementById('projects')
      if (!target) return false
      return Math.abs(target.getBoundingClientRect().top) < 200
    }, undefined, { timeout: 300 })
  })
})

test.describe('forced colors', () => {
  test.use({ locale: locale.language })

  test('preserves component boundaries and focus indication', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    await pinLocale(page.context(), locale, baseURL!)
    await seedTheme(page, 'light')
    await page.emulateMedia({ forcedColors: 'active' })
    await page.goto(locale.path)
    await waitForHydration(page)

    const card = page.locator('.contact.card')
    const border = await card.evaluate((el) => {
      const style = getComputedStyle(el)
      return { style: style.borderStyle, width: Number.parseFloat(style.borderWidth) }
    })
    expect(border.style, 'forced-colors mode must not remove the card border').not.toBe('none')
    expect(border.width, 'forced-colors mode must keep a non-zero border width').toBeGreaterThan(0)

    const toggle = page.locator('.theme-toggle')
    await toggle.focus()
    const outline = await toggle.evaluate((el) => {
      const style = getComputedStyle(el)
      return { style: style.outlineStyle, width: Number.parseFloat(style.outlineWidth) }
    })
    expect(outline.style, 'forced-colors mode must keep the focus outline visible').not.toBe('none')
    expect(outline.width).toBeGreaterThan(0)
  })
})

/**
 * 5.10 — Тема по умолчанию идёт от `prefers-color-scheme`, пока пользователь
 * не сделал явный выбор. Явный выбор, лежащий в localStorage, должен
 * пережить перезагрузку и не поддаться смене системной темы.
 */
test.describe('theme preference source', () => {
  test.use({ locale: locale.language })

  test('the OS color-scheme selects the theme when nothing is stored', async ({ page, baseURL, context }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    await pinLocale(context, locale, baseURL!)
    await page.emulateMedia({ colorScheme: 'light' })

    await page.goto(locale.path)
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('an explicit stored preference overrides the OS preference across reload', async ({ page, baseURL, context }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    await pinLocale(context, locale, baseURL!)
    await page.emulateMedia({ colorScheme: 'dark' })
    await seedTheme(page, 'light')

    await page.goto(locale.path)
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.reload()
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })
})
