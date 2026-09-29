import { expect, test } from '@playwright/test'
import { allSurfaces, surfaceLabel } from '../support/surfaces'
import { openSurface } from '../support/harness'
import { expectNoViolations } from '../support/axe'

/**
 * Автоматическое сканирование правил по всей матрице поверхностей.
 *
 * Здесь только то, что axe умеет проверять сам. Всё, что требует
 * взаимодействия — клавиатура, фокус, объявления — лежит в
 * `tests/a11y/behavior/`.
 */

for (const surface of allSurfaces()) {
  test.describe(`axe · ${surfaceLabel(surface)}`, () => {
    test.use({ locale: surface.locale.language })

    test('has no WCAG 2.2 A/AA violations', async ({ page, baseURL }, testInfo) => {
      await openSurface(page, surface, baseURL!)
      await expectNoViolations(page, surfaceLabel(surface), testInfo)
    })
  })
}

/**
 * Развёрнутое меню — отдельное состояние разметки, и сканировать его нужно
 * тоже. Бургер существует только ниже точки перелома, поэтому вариант
 * генерируется лишь для узких ширин.
 */
for (const surface of allSurfaces().filter(s => s.viewport.headerCollapsed)) {
  test.describe(`axe · menu expanded · ${surfaceLabel(surface)}`, () => {
    test.use({ locale: surface.locale.language })

    test('has no WCAG 2.2 A/AA violations', async ({ page, baseURL }, testInfo) => {
      await openSurface(page, surface, baseURL!)

      const burger = page.locator('button[aria-controls="site-menu"]')
      await expect(burger).toBeVisible()
      await burger.click()

      // Сканируем только после подтверждения состояния: иначе можно
      // просканировать всё ещё свёрнутое меню и решить, что всё хорошо.
      await expect(burger).toHaveAttribute('aria-expanded', 'true')
      await expect(page.locator('#site-menu')).toBeVisible()

      await expectNoViolations(
        page,
        `${surfaceLabel(surface)} · menu expanded`,
        testInfo,
      )
    })
  })
}
