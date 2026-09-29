import { expect, test } from '@playwright/test'
import {
  DESKTOP,
  HEADER_COLLAPSE_BREAKPOINT_PX,
  LOCALES,
  MOBILE,
  THEMES,
  allSurfaces,
} from './support/surfaces'
import { THEME_STORAGE_KEY, openSurface, seedTheme, waitForHydration } from './support/harness'

/**
 * Проверки самих хелперов.
 *
 * Если пиннинг локали или темы работает не так, как задумано, то все
 * остальные тесты молча проверяют не ту поверхность. Поэтому у хелперов
 * есть собственные тесты.
 */

test.describe('surface matrix', () => {
  test('expands to every locale × theme × viewport combination', () => {
    const surfaces = allSurfaces()

    expect(surfaces).toHaveLength(LOCALES.length * THEMES.length * 2)

    const labels = surfaces.map(s => `${s.locale.code}/${s.theme}/${s.viewport.name}`)
    expect(new Set(labels).size).toBe(labels.length)
    expect(labels.sort()).toEqual([
      'en/dark/desktop',
      'en/dark/mobile',
      'en/light/desktop',
      'en/light/mobile',
      'ru/dark/desktop',
      'ru/dark/mobile',
      'ru/light/desktop',
      'ru/light/mobile',
    ])
  })

  test('viewport widths straddle the header breakpoint', () => {
    expect(DESKTOP.width).toBeGreaterThan(HEADER_COLLAPSE_BREAKPOINT_PX)
    expect(MOBILE.width).toBeLessThan(HEADER_COLLAPSE_BREAKPOINT_PX)
    expect(DESKTOP.headerCollapsed).toBe(false)
    expect(MOBILE.headerCollapsed).toBe(true)
  })
})

/**
 * Локаль пиннится кукой, а не надеждой на то, что редирект не сработает.
 * Прогон под `--repeat-each` показывает, что флака нет — см. задачу 2.2.
 */
for (const locale of LOCALES) {
  test.describe(`locale pinning · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test(`lands on ${locale.path} with lang="${locale.code}"`, async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'dark', viewport: DESKTOP }, baseURL!)

      expect(new URL(page.url()).pathname).toBe(locale.path)
      // i18n проставляет полный BCP-47 с регионом (`ru-RU`), а не только
      // код языка — это корректное объявление языка, просто более точное.
      await expect(page.locator('html')).toHaveAttribute('lang', locale.language)
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
    })
  })
}

/**
 * Тема должна стоять уже на первой отрисовке. Наблюдаем все значения
 * `data-theme`, которые вообще появлялись на <html>: если применение
 * съехало в гидратацию, в списке будет промежуточное состояние.
 */
for (const theme of THEMES) {
  test(`theme seeding · ${theme} is applied before first paint`, async ({ page, baseURL }) => {
    await page.addInitScript(() => {
      const seen: string[] = []
      ;(window as unknown as { __themeValues: string[] }).__themeValues = seen

      const record = () => {
        const value = document.documentElement?.dataset.theme
        if (value && seen[seen.length - 1] !== value) seen.push(value)
      }

      // Наблюдаем за `document`, а не за `documentElement`: init-скрипт
      // выполняется раньше любого скрипта страницы, и <html> на этот момент
      // может ещё не существовать. `document` существует всегда, а его
      // поддерево включает <html>.
      new MutationObserver(record).observe(document, {
        subtree: true,
        attributes: true,
        attributeFilter: ['data-theme'],
      })
      record()
    })
    await seedTheme(page, theme)

    await page.goto(`${baseURL}/`)
    await waitForHydration(page)

    const seen = await page.evaluate(
      () => (window as unknown as { __themeValues: string[] }).__themeValues,
    )

    // Ровно одно значение за всё время жизни страницы — значит мелькания
    // противоположной темы не было.
    expect(seen).toEqual([theme])
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  })
}

test('theme seeding writes the key the app actually reads', async ({ page, baseURL }) => {
  await seedTheme(page, 'light')
  await page.goto(`${baseURL}/`)
  await waitForHydration(page)

  expect(await page.evaluate(key => localStorage.getItem(key), THEME_STORAGE_KEY)).toBe('light')
})
