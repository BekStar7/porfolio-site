import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { allSurfaces, surfaceLabel } from '../support/surfaces'
import type { Surface } from '../support/surfaces'
import { openSurface } from '../support/harness'
import { incompleteContrastTargets } from '../support/axe'
import { banner, featuredProject, hero, section } from '../support/locators'

/**
 * axe не умеет считать контраст поверх полупрозрачных слоёв: он не знает,
 * что окажется под `--accent-veil` или под свечением в hero, и помечает такие
 * узлы как `incomplete`, а не как нарушение. Именно для них написан
 * `scripts/check-contrast.mjs` — он берёт токены из `main.css` и складывает
 * слои сам.
 *
 * Поэтому `incomplete` не валит прогон. Но и игнорировать его целиком нельзя:
 * новая непросчитываемая поверхность должна попадать на глаза. База ниже —
 * явный список областей страницы, в которых мы про такие узлы уже знаем.
 *
 * Область, а не класс: узел становится `incomplete` из-за слоя под ним, а не
 * из-за себя самого, поэтому любой узел внутри области делит её причину. Классы
 * в базе не участвуют, и любая перестройка стилей её не ломает. Цена — новый
 * узел внутри известной области больше не бросается в глаза; его слой всё равно
 * тот же, а `pnpm check:contrast` остаётся арбитром по слоям.
 */

interface Region {
  /** Имя области для сообщения об ошибке. */
  name: string
  /** Слой-виновник: почему axe не может определить фон под текстом. */
  layer: string
  locate: (page: Page, surface: Surface) => Locator
  /** Слой есть не на всех поверхностях: например, градиент карточки — только от 56rem. */
  appliesTo?: (surface: Surface) => boolean
}

const REGIONS: readonly Region[] = [
  {
    name: 'header',
    layer: '`--bg-veil` (0.72) и `backdrop-filter: blur(14px)`: сквозь шапку видно свечение hero',
    locate: page => banner(page),
  },
  {
    name: 'hero',
    layer: '`--glow` — радиальный градиент, лежащий поверх текста первого экрана',
    locate: page => hero(page),
  },
  {
    name: 'contact',
    layer: '`--accent-veil` — радиальный градиент карточки контактов поверх `--surface`',
    locate: (page, { locale }) => section(page, locale, 'contact'),
  },
  {
    name: 'featured project',
    layer: '`--accent-veil` — линейный градиент выделенного проекта, действует от 56rem',
    locate: page => featuredProject(page),
    appliesTo: ({ viewport }) => viewport.width >= 56 * 16,
  },
  {
    name: 'experience timeline',
    layer: 'псевдоэлементы: линия и точки таймлайна, маркер заметки и пункты списка',
    locate: (page, { locale }) => section(page, locale, 'experience'),
  },
]

/** В какую область попал узел: индекс, -1 — ни в одну, -2 — селектор axe не нашёл элемент. */
async function placeInRegions(page: Page, targets: string[], regions: Locator[]) {
  const handles = await Promise.all(regions.map(region => region.elementHandle()))

  return page.evaluate(({ selectors, containers }) => selectors.map((selector) => {
    let element: Element | null = null
    try {
      element = document.querySelector(selector)
    }
    catch {
      // Селектор axe, который querySelector не разбирает, считается ненайденным
    }
    if (!element) return { selector, region: -2, html: '' }
    return {
      selector,
      region: containers.findIndex(container => container.contains(element)),
      html: element.outerHTML.replace(/\s+/g, ' ').slice(0, 140),
    }
  }), { selectors: targets, containers: handles })
}

for (const surface of allSurfaces()) {
  test.describe(`contrast baseline · ${surfaceLabel(surface)}`, () => {
    test.use({ locale: surface.locale.language })

    test('reports no unlisted incomplete-contrast nodes', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      const placed = await placeInRegions(
        page,
        await incompleteContrastTargets(page),
        REGIONS.map(region => region.locate(page, surface)),
      )

      const outside = placed.filter(node => node.region < 0)
      expect(
        outside.map(node => `${node.selector} — ${node.html || 'element not found'}`),
        [
          `New node(s) whose contrast axe cannot resolve on ${surfaceLabel(surface)}, outside every known region.`,
          'Verify the contrast by hand (pnpm check:contrast covers the token palette),',
          'then add the region to REGIONS with the layer that causes it.',
        ].join('\n'),
      ).toEqual([])

      // Обратная сторона: область, в которой не осталось ни одного такого узла,
      // — устаревшая запись. Иначе база копила бы причины, которых уже нет.
      const hit = new Set(placed.map(node => node.region))
      const stale = REGIONS
        .filter(region => region.appliesTo?.(surface) ?? true)
        .filter(region => !hit.has(REGIONS.indexOf(region)))
        .map(region => `${region.name} (${region.layer})`)

      expect(
        stale,
        `Region(s) with no incomplete node on ${surfaceLabel(surface)}: the layer is gone or the entry is stale. Remove it from REGIONS.`,
      ).toEqual([])
    })
  })
}
