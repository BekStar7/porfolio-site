import { expect, test } from '@playwright/test'
import { DESKTOP, LOCALES } from '../support/surfaces'
import { openSurface, pinLocale, seedTheme, waitForHydration } from '../support/harness'

/**
 * 5.7 — В любой момент отмеченным «текущим» может быть не больше одного
 * пункта меню, и это должен быть тот раздел, что реально виден в окне.
 * Разметка идёт через `aria-current="location"` (WCAG подсказывает это
 * значение именно для «раздела на этой же странице», а не `"true"`, которое
 * годится для чего угодно).
 */
for (const locale of LOCALES) {
  test.describe(`current section · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('marks exactly one nav link as the current location, matching the visible section', async ({ page, baseURL }) => {
      await openSurface(page, { locale, theme: 'light', viewport: DESKTOP }, baseURL!)

      await page.evaluate(() => document.getElementById('experience')?.scrollIntoView({ block: 'center' }))
      await page.waitForFunction(() => document.querySelectorAll('.header__link[aria-current]').length > 0)

      const current = page.locator('.header__link[aria-current]')
      await expect(current).toHaveCount(1)
      await expect(current).toHaveAttribute('href', '#experience')
      await expect(current).toHaveAttribute('aria-current', 'location')
    })
  })
}

/**
 * 5.8 — `active` стартует как `null` и на сервере, и на клиенте:
 * IntersectionObserver подключается только в `onMounted`, поэтому в момент,
 * когда гидратация завершается, разметка меню обязана совпадать с тем, что
 * прислал сервер.
 *
 * Проверить это через предупреждение Vue о расхождении гидратации нельзя:
 * внутренний детектор Vue (`propHasMismatch` в `@vue/runtime-core`) сверяет
 * атрибуты только по жёсткому списку известных HTML/SVG-атрибутов плюс
 * `class`/`style`/булевы — `aria-*` в этот список не входит принципиально,
 * так что расхождение по `aria-current` Vue никогда не залогирует, даже
 * настоящее. Поэтому тест перехватывает сам `IntersectionObserver.observe` —
 * он вызывается синхронно внутри `onMounted`, то есть внутри того же вызова
 * `mount()`, которым Vue гидратирует дерево. Разметка меню на момент первого
 * `observe()` — это и есть то самое дерево, с которым сверялась гидратация,
 * снятое синхронным перехватом метода, а не гонкой с асинхронным колбэком
 * наблюдателя (спецификация IntersectionObserver гарантирует, что сам колбэк
 * сработает позже, а не в момент вызова `observe()`).
 */
for (const locale of LOCALES) {
  test.describe(`current section hydration · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('produces no hydration mismatch for current-location marking', async ({ page, baseURL, request }) => {
      const response = await request.get(baseURL! + locale.path)
      const html = await response.text()
      const navBlock = html.match(/<nav id="site-menu"[\s\S]*?<\/nav>/)?.[0] ?? ''
      expect(navBlock, 'the section nav must be present in the delivered markup').not.toBe('')
      expect(
        navBlock.includes('aria-current'),
        'delivered markup must not pre-mark a current section — only the client knows what is in view',
      ).toBe(false)

      await page.setViewportSize({ width: DESKTOP.width, height: DESKTOP.height })
      await pinLocale(page.context(), locale, baseURL!)
      await seedTheme(page, 'light')

      // Перехватываем `observe()` до того, как выполнится хоть один скрипт
      // страницы: нужно поймать самый первый вызов, сделанный `onMounted`.
      await page.addInitScript(() => {
        const Native = window.IntersectionObserver
        ;(window as unknown as { __navAtObserve: string | null }).__navAtObserve = null
        window.IntersectionObserver = class extends Native {
          observe(target: Element) {
            const marker = window as unknown as { __navAtObserve: string | null }
            if (marker.__navAtObserve === null) {
              marker.__navAtObserve = document.getElementById('site-menu')?.innerHTML ?? ''
            }
            super.observe(target)
          }
        }
      })

      await page.goto(locale.path)
      await waitForHydration(page)
      await page.waitForFunction(() => (window as unknown as { __navAtObserve: string | null }).__navAtObserve !== null)

      const navAtObserve = await page.evaluate(() => (window as unknown as { __navAtObserve: string }).__navAtObserve)

      expect(navAtObserve, 'the nav must be present when the observer first attaches').not.toBe('')
      expect(
        navAtObserve.includes('aria-current'),
        'the hydrated nav must carry no aria-current at the moment the observer first attaches — the client\'s initial render must match delivered SSR markup',
      ).toBe(false)
    })
  })
}
