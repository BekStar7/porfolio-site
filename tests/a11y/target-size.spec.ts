import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { LOCALES, VIEWPORTS } from '../support/surfaces'
import type { LocaleSurface } from '../support/surfaces'
import { intersects, openSurface } from '../support/harness'
import {
  callToActionControls,
  localeLinks,
  menuButton,
  siteNavLinks,
  themeToggle,
} from '../support/locators'
import { describeElement } from '../support/aria'

/**
 * WCAG 2.5.8 (Target Size, Minimum, AA): автономная цель нажатия — не внутри
 * блока текста — должна быть не меньше 24×24 CSS-пикселей, а её область не
 * должна перекрываться с соседней целью. Проверяем реальные `boundingBox`,
 * а не заявленные `min-width`/`min-height`: реальный размер зависит ещё и от
 * содержимого и `padding`.
 */
const TARGETS: { name: string, locate: (page: Page, locale: LocaleSurface) => Locator }[] = [
  { name: 'section menu links', locate: siteNavLinks },
  { name: 'menu button', locate: page => menuButton(page) },
  { name: 'language links', locate: localeLinks },
  { name: 'theme toggle', locate: themeToggle },
  { name: 'call-to-action controls', locate: callToActionControls },
]

for (const locale of LOCALES) {
  for (const viewport of VIEWPORTS) {
    const surface = { locale, theme: 'light' as const, viewport }

    test.describe(`target sizes · ${locale.code} · ${viewport.name}`, () => {
      test.use({ locale: locale.language })

      test('standalone controls are at least 24×24px and do not overlap', async ({ page, baseURL }) => {
        await openSurface(page, surface, baseURL!)

        // Ссылки меню на узкой ширине скрыты, пока меню не раскрыто — их
        // тоже нужно измерить, а не только бургер, который их раскрывает.
        if (viewport.headerCollapsed) {
          const burger = menuButton(page)
          await burger.click()
          await expect(burger).toHaveAttribute('aria-expanded', 'true')
        }

        const boxes: { label: string, box: { x: number, y: number, width: number, height: number } }[] = []

        for (const { locate } of TARGETS) {
          const locatorAll = locate(page, locale)
          const total = await locatorAll.count()

          for (let index = 0; index < total; index++) {
            const control = locatorAll.nth(index)
            if (!await control.isVisible()) continue

            const box = await control.boundingBox()
            if (!box) continue

            boxes.push({ label: await describeElement(control), box })
          }
        }

        expect(boxes.length, 'no standalone controls found — is the page rendered?').toBeGreaterThan(0)

        const tooSmall = boxes
          .filter(({ box }) => box.width < 24 || box.height < 24)
          .map(({ label, box }) => `${label} — ${Math.round(box.width)}×${Math.round(box.height)}`)
        expect(tooSmall, 'controls smaller than the 24×24 CSS px minimum').toEqual([])

        const overlapping: string[] = []
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            if (intersects(boxes[i]!.box, boxes[j]!.box)) {
              overlapping.push(`${boxes[i]!.label} overlaps ${boxes[j]!.label}`)
            }
          }
        }
        expect(overlapping, 'standalone controls must not share hit-test area').toEqual([])
      })
    })
  }
}
