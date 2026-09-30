import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { DESKTOP, LOCALES, MOBILE, THEMES, VIEWPORTS, allSurfaces, localeByCode, surfaceLabel } from '../../tests/support/surfaces'
import type { Surface, ThemeName } from '../../tests/support/surfaces'
import { openSurface, pinLocale, seedTheme, waitForHydration } from '../../tests/support/harness'
import { messages } from '../../tests/support/messages'

/**
 * Паритет отображения на время миграции стилей (см. playwright.parity.config.ts).
 *
 * Эталоны снимаются один раз с нормализованного по сетке сайта, дальше каждая
 * правка обязана давать те же пиксели. Поэтому спецификация не смотрит ни на
 * классы, ни на структуру стилей: элементы находятся по роли, тексту и
 * атрибутам, которые миграция не трогает.
 *
 * Подписи «сколько лет и месяцев» у текущих должностей считаются от текущего
 * месяца. Эталоны и сверки нужно гонять в пределах одного календарного месяца,
 * иначе на стыке месяцев разойдётся текст, а не вёрстка.
 */

const slug = ({ locale, theme, viewport }: Surface) => `${locale.code}-${theme}-${viewport.name}`

/**
 * 1. Полная страница на каждой поверхности матрицы. Тем же именем эталона
 *    проверяется загрузка без JavaScript — ниже.
 */
for (const surface of allSurfaces()) {
  test.describe(`page · ${surfaceLabel(surface)}`, () => {
    test.use({ locale: surface.locale.language })

    test('matches the baseline', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)
      await expect(page).toHaveScreenshot(`${slug(surface)}.png`, { fullPage: true })
    })
  })
}

/**
 * 2. Без JavaScript. Тему и локаль в этом режиме задают не скрипт и не куки
 *    с localStorage, а `prefers-color-scheme` и уже пререндеренный HTML.
 *    Снимок обязан совпасть с гидратированным: стили компонентов приходят
 *    вместе со страницей, а не после JS.
 */
for (const surface of allSurfaces()) {
  test.describe(`no javascript · ${surfaceLabel(surface)}`, () => {
    test.use({
      locale: surface.locale.language,
      javaScriptEnabled: false,
      colorScheme: surface.theme,
    })

    test('renders like the hydrated page', async ({ page, baseURL }) => {
      await page.setViewportSize({ width: surface.viewport.width, height: surface.viewport.height })
      await pinLocale(page.context(), surface.locale, baseURL!)
      await page.goto(surface.locale.path)
      await expect(page).toHaveScreenshot(`${slug(surface)}.png`, { fullPage: true })
    })
  })
}

/**
 * 3. Раскрытое мобильное меню. Оно накладывается на страницу, поэтому снимаем
 *    экран, а не всю высоту.
 */
for (const locale of LOCALES) {
  for (const theme of THEMES) {
    test.describe(`menu open · ${locale.code} · ${theme}`, () => {
      test.use({ locale: locale.language })

      test('matches the baseline', async ({ page, baseURL }) => {
        await openSurface(page, { locale, theme, viewport: MOBILE }, baseURL!)

        const burger = page.locator('button[aria-controls="site-menu"]')
        await burger.click()
        await expect(burger).toHaveAttribute('aria-expanded', 'true')
        // Фокус остаётся на бургере, но рамка фокуса от мыши не рисуется — снимок
        // не зависит от того, как именно меню было открыто.
        await expect(page).toHaveScreenshot(`menu-open-${locale.code}-${theme}.png`)
      })
    })
  }
}

/**
 * 4. Шапка ровно на границе сворачивания. Правило «≤ 62rem» включает 992px, а
 *    `min-width`-подход включил бы его только с 991px — эта пара ширин ловит
 *    смещение границы на пиксель.
 */
const RU = localeByCode('ru')

for (const width of [992, 993]) {
  for (const theme of THEMES) {
    test.describe(`header at ${width}px · ${theme}`, () => {
      test.use({ locale: RU.language })

      test('matches the baseline', async ({ page, baseURL }) => {
        await pinLocale(page.context(), RU, baseURL!)
        await seedTheme(page, theme)
        await page.setViewportSize({ width, height: DESKTOP.height })
        await page.goto(RU.path)
        await waitForHydration(page)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)

        await expect(page.getByRole('banner')).toHaveScreenshot(`header-${width}-${theme}.png`)
      })
    })
  }
}

/**
 * 5. Состояния фокуса и наведения на рабочем столе. Фокус ведём клавиатурой,
 *    чтобы сработал `:focus-visible`, как у настоящего пользователя.
 */
async function openDesktop(page: Page, baseURL: string, theme: ThemeName) {
  await openSurface(page, { locale: RU, theme, viewport: DESKTOP }, baseURL)
}

for (const theme of THEMES) {
  test.describe(`focus · ${theme}`, () => {
    test.use({ locale: RU.language })

    // 1 — skip-ссылка выезжает из-за края, 2 — логотип, 3 — первая ссылка меню
    for (const stop of [1, 2, 3]) {
      test(`Tab stop ${stop}`, async ({ page, baseURL }) => {
        await openDesktop(page, baseURL!, theme)

        if (stop === 1) {
          const skip = page.getByRole('link', { name: messages(RU).a11y.skipToContent })
          await page.keyboard.press('Tab')
          await expect(skip).toBeFocused()
        }
        else {
          for (let index = 0; index < stop; index++) await page.keyboard.press('Tab')
        }
        await expect(page).toHaveScreenshot(`focus-${stop}-${theme}.png`)
      })
    }
  })

  test.describe(`hover · ${theme}`, () => {
    test.use({ locale: RU.language })

    const targets = {
      'cta-primary': 'main a[href="#contact"]',
      'cta-ghost': 'main a[href="#projects"]',
      'nav-link': 'header a[href="#about"]',
    } as const

    for (const [name, selector] of Object.entries(targets)) {
      test(name, async ({ page, baseURL }) => {
        await openDesktop(page, baseURL!, theme)
        await page.locator(selector).first().hover()
        await expect(page).toHaveScreenshot(`hover-${name}-${theme}.png`)
      })
    }
  })
}

/**
 * 6. Режим высокой контрастности: границы карточек, тегов и кнопок не должны
 *    исчезать, а рамка фокуса берёт системный цвет.
 */
test.describe('forced colors', () => {
  test.use({ locale: RU.language })

  test('matches the baseline', async ({ page, baseURL }) => {
    await page.emulateMedia({ forcedColors: 'active' })
    await openDesktop(page, baseURL!, 'dark')
    await expect(page).toHaveScreenshot('forced-colors-ru-desktop.png', { fullPage: true })
  })
})

/**
 * 7. Вычисленные стили базовых элементов.
 *
 *    Сброс и типографика переезжают из `main.css` в базовый слой, и скриншоты
 *    не заметят, если, например, у неразмеченного списка пропадут маркеры или
 *    у `strong` изменится вес. Поэтому у базовых элементов снимаются сами
 *    вычисленные значения. В разметке нет `strong`, `b`, `img` и списков без
 *    класса, поэтому их создаёт тест, а остальное находится по роли и тексту.
 *    Вес 550 и 650 не входит в шкалу Tailwind по умолчанию: проверяем и его.
 */
const PROBED = [
  'boxSizing',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'display',
  'listStyleType',
  'listStylePosition',
  'maxWidth',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'color',
] as const

/** У списков дополнительно смотрим отступ: без класса он обязан остаться. */
const LIST_PROBED = [...PROBED, 'paddingInlineStart'] as const

/** Настройки документа, которые сброс обязан сохранить. */
const DOCUMENT_PROBED = [
  'webkitTextSizeAdjust',
  'scrollBehavior',
  'scrollPaddingTop',
  'fontSynthesisWeight',
  'minHeight',
  'textRendering',
  'backgroundColor',
] as const

async function stylesOf(locator: Locator, props: readonly string[]) {
  return locator.first().evaluate((el, list) => {
    const computed = getComputedStyle(el) as unknown as Record<string, string>
    return Object.fromEntries(list.map(name => [name, computed[name]]))
  }, props)
}

async function injectProbeElements(page: Page) {
  await page.evaluate(() => {
    const box = document.createElement('div')
    box.innerHTML = [
      '<p data-probe="paragraph">plain</p>',
      '<p><strong data-probe="strong">s</strong> <b data-probe="b">b</b></p>',
      '<img data-probe="img" alt="" width="8" height="8" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=">',
      '<button data-probe="button" type="button">button</button>',
      '<ul data-probe="list-unclassed"><li>u</li></ul>',
      '<ol data-probe="ordered-unclassed"><li>o</li></ol>',
    ].join('')
    document.querySelector('main')!.append(box)
  })
}

for (const viewport of VIEWPORTS) {
  test.describe(`computed styles · ${viewport.name}`, () => {
    test.use({ locale: RU.language })

    test('base elements keep their computed styles', async ({ page, baseURL }) => {
      await openSurface(page, { locale: RU, theme: 'dark', viewport }, baseURL!)
      await injectProbeElements(page)

      const probe = (name: string) => page.locator(`[data-probe="${name}"]`)
      const nav = page.getByRole('navigation', { name: messages(RU).a11y.sectionsNav, includeHidden: true })

      const elements: Record<string, Locator> = {
        body: page.locator('body'),
        h1: page.getByRole('heading', { level: 1 }),
        h2: page.getByRole('heading', { level: 2 }),
        h3: page.getByRole('heading', { level: 3 }),
        h4: page.getByRole('heading', { level: 4 }),
        paragraph: probe('paragraph'),
        'about-paragraph': page.locator('#about p').first(),
        img: probe('img'),
        svg: page.locator('svg').first(),
        button: probe('button'),
        'page-button': page.locator('main button').first(),
        'list-classed': page.getByRole('list', { name: messages(RU).a11y.socialLinks }).first(),
        'list-unclassed': probe('list-unclassed'),
        'ordered-unclassed': probe('ordered-unclassed'),
        strong: probe('strong'),
        b: probe('b'),
        // Вес 550
        'nav-link': nav.getByRole('link', { includeHidden: true }).first(),
        'project-summary': page.locator('#projects article p').nth(1),
        'about-quote': page.locator('#about blockquote'),
        // Вес 650
        'brand-link': page.getByRole('banner').getByRole('link').first(),
        'skill-group-title': page.locator('#skills h3').first(),
        'role-title': page.locator('#experience h4').first(),
      }

      const snapshot: Record<string, Record<string, string>> = {
        html: await stylesOf(page.locator('html'), DOCUMENT_PROBED),
        body: await stylesOf(elements.body!, [...PROBED, ...DOCUMENT_PROBED]),
      }
      for (const [name, locator] of Object.entries(elements)) {
        if (name === 'body') continue
        await expect(locator.first(), `${name} was not found`).toBeAttached()
        snapshot[name] = await stylesOf(locator, name.startsWith('list') || name.startsWith('ordered') ? LIST_PROBED : PROBED)
      }

      expect(JSON.stringify(snapshot, null, 2)).toMatchSnapshot(`computed-styles-${viewport.name}.json`)
    })
  })
}
