import { expect, test } from '@playwright/test'
import { DESKTOP, localeByCode } from '../support/surfaces'
import { pinLocale, waitForHydration } from '../support/harness'

/**
 * 5.11 — Playwright даёт каждому тесту свой `BrowserContext`: своё
 * localStorage, свои куки, свой `locale` контекста браузера. Ничего
 * специального в приложении для этого не нужно — тест здесь доказывает само
 * свойство, а не чинит утечку. Первый тест сознательно оставляет за собой
 * «грязный» выбор темы и локали `en`; если бы контексты не изолировались,
 * второй тест — настроенный на `ru` через `test.use`, без единой ручной
 * куки или значения в localStorage — унаследовал бы `en` и тёмную тему.
 */
const en = localeByCode('en')
const ru = localeByCode('ru')

test.describe('per-test isolation · leaves state behind', () => {
  test.use({ locale: en.language })

  test('a preference set here must not leak to the next test', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    await pinLocale(page.context(), en, baseURL!)
    await page.addInitScript(() => window.localStorage.setItem('portfolio-theme', 'dark'))
    await page.emulateMedia({ colorScheme: 'dark' })

    await page.goto(en.path)
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('lang', en.language)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })
})

test.describe('per-test isolation · starts clean', () => {
  test.use({ locale: ru.language })

  test('a fresh test sees no trace of the previous test’s preferences', async ({ page, baseURL }) => {
    await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
    // Намеренно не вызываем pinLocale и не сеем тему: если бы контекст
    // прошлого теста протёк, здесь оказались бы 'en' и тёмная тема без
    // единой настройки в этом тесте — только `test.use({ locale })` выше,
    // который сам по себе не куки и не localStorage, а свойство контекста.
    await page.emulateMedia({ colorScheme: 'light' })

    await page.goto(ru.path)
    await waitForHydration(page)
    await expect(page.locator('html')).toHaveAttribute('lang', ru.language)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    const leaked = await page.evaluate(() => window.localStorage.getItem('portfolio-theme'))
    expect(leaked, 'localStorage must not carry state from a previous test').toBeNull()
  })
})
