import { expect, test } from '@playwright/test'
import { allSurfaces, surfaceLabel } from '../support/surfaces'
import { openSurface } from '../support/harness'
import { incompleteContrastComponents } from '../support/axe'

/**
 * axe не умеет считать контраст поверх полупрозрачных слоёв и псевдоэлементов:
 * он не знает, что окажется под `--accent-veil` или под линией таймлайна, и
 * помечает такие узлы как `incomplete`, а не как нарушение. Именно для них написан
 * `scripts/check-contrast.mjs` — он берёт токены из `main.css` и складывает
 * слои сам.
 *
 * Поэтому `incomplete` не валит прогон. Но и игнорировать его целиком нельзя:
 * новая непросчитываемая поверхность должна попадать на глаза. База ниже —
 * явный список тех узлов, про которые мы уже знаем.
 */

/**
 * Компоненты, по которым axe заведомо не может вычислить контраст.
 * Сгруппированы по слою-виновнику; формулировки причин — те, которые выдаёт
 * сам axe («background gradient», «pseudo element»), а слой найден обходом
 * предков и наложений.
 */
const KNOWN_INCOMPLETE_CONTRAST: readonly string[] = [
  // Таймлайн опыта от 44rem: линия между логотипами рисуется
  // псевдоэлементом (`.timeline__item::before`), а для axe непустой
  // псевдоэлемент — повод отказаться от расчёта фона у всего, что над ним.
  // На узком экране линии нет, и этот список там пуст.
  '.app-link',
  '.job__company',
  '.job__location',
  '.job__note',
  '.role__duration',
  '.role__period',
]

for (const surface of allSurfaces()) {
  test.describe(`contrast baseline · ${surfaceLabel(surface)}`, () => {
    test.use({ locale: surface.locale.language })

    test('reports no unlisted incomplete-contrast nodes', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      const components = await incompleteContrastComponents(page)
      const unlisted = components.filter(name => !KNOWN_INCOMPLETE_CONTRAST.includes(name))

      expect(
        unlisted,
        [
          `New node(s) whose contrast axe cannot resolve on ${surfaceLabel(surface)}.`,
          'Verify the contrast by hand (pnpm check:contrast covers the token palette),',
          'then add the selector to KNOWN_INCOMPLETE_CONTRAST with the reason.',
        ].join('\n'),
      ).toEqual([])
    })
  })
}
