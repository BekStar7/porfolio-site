import { expect, test } from '@playwright/test'
import { allSurfaces, surfaceLabel } from '../support/surfaces'
import { openSurface } from '../support/harness'
import { incompleteContrastComponents } from '../support/axe'

/**
 * axe не умеет считать контраст поверх полупрозрачных слоёв: он не знает,
 * что окажется под `--accent-veil` или под свечением в hero, и помечает такие
 * узлы как `incomplete`, а не как нарушение. Именно для них написан
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
  // Свечение hero: `.hero__glow` (токен `--glow`) — радиальный градиент,
  // лежащий поверх текста hero. Шапка липкая и полупрозрачная
  // (`--bg-veil`, 0.72) плюс `backdrop-filter: blur(14px)`, поэтому сквозь неё
  // видно то же свечение — её ссылки попадают сюда по той же причине.
  '.header__link',
  '.header__name',
  '.hero__greeting',
  '.hero__location',
  '.hero__name',
  '.hero__role',
  '.hero__tagline',
  '.locale-switcher__link',

  // Карточка контактов: `.contact` красит себя
  // `radial-gradient(… var(--accent-veil) …)` поверх `--surface`.
  // Заголовок секции живёт внутри этой же карточки.
  '.btn',
  '.contact__lead',
  '.contact__social-handle',
  '.contact__social-name',
  '.contact__where',
  '.section__eyebrow',
  '.section__head',

  // Выделенный проект: `.project--featured` от 56rem получает
  // `linear-gradient(… var(--accent-veil) …)` поверх `--surface`.
  '.project__description',
  '.project__impact',
  '.project__period',
  '.project__summary',
  '.project__title',

  // Таймлайн опыта: псевдоэлементы рисуют линию и точки
  // (`.timeline__item::before`), маркер заметки (`.job__note::before`)
  // и пункты списка (`.role__highlights > li::before`). Для axe непустой
  // псевдоэлемент — повод отказаться от расчёта фона.
  '.job__company',
  '.job__location',
  '.job__note',
  '.role__duration',
  '.role__highlights',
  '.role__period',
  '.role__title',

  // Утилитарный класс, встречается сразу в нескольких местах: внутри
  // выделенного проекта (градиент) и внутри таймлайна (псевдоэлемент).
  '.app-link',
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
