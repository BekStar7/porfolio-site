/**
 * Матрица поверхностей: локали × темы × ширины экрана.
 *
 * Требования к покрытию комбинаторные, поэтому они заданы здесь один раз и
 * разворачиваются в тесты генератором. Добавить локаль или страницу — правка
 * в одном месте, а не копия файла с тестами.
 */

/** Точка перелома шапки: ниже неё появляется бургер, а меню сворачивается. */
export const HEADER_COLLAPSE_BREAKPOINT_REM = 62

/** То же в пикселях при корневом размере 16px — с ним сравниваются ширины ниже. */
export const HEADER_COLLAPSE_BREAKPOINT_PX = HEADER_COLLAPSE_BREAKPOINT_REM * 16

export type ThemeName = 'light' | 'dark'

export interface LocaleSurface {
  /** Код локали для `lang` и для контекста браузера */
  code: 'ru' | 'en'
  /** BCP-47, как его проставляет @nuxtjs/i18n */
  language: 'ru-RU' | 'en-US'
  /** Путь страницы при стратегии prefix_except_default */
  path: string
  /** Локаль по умолчанию отдаётся с корня и потому чувствительна к редиректу */
  isDefault: boolean
}

export interface ViewportSurface {
  name: 'desktop' | 'mobile'
  width: number
  height: number
  /** Свёрнута ли шапка на этой ширине — производное от точки перелома */
  headerCollapsed: boolean
}

export const LOCALES: readonly LocaleSurface[] = [
  { code: 'ru', language: 'ru-RU', path: '/', isDefault: true },
  { code: 'en', language: 'en-US', path: '/en', isDefault: false },
]

export const THEMES: readonly ThemeName[] = ['light', 'dark']

/**
 * Ширины намеренно лежат по разные стороны точки перелома: ни одна из них
 * в одиночку не проходит оба пути шапки.
 */
export const VIEWPORTS: readonly ViewportSurface[] = [
  {
    name: 'desktop',
    width: HEADER_COLLAPSE_BREAKPOINT_PX + 288, // 1280
    height: 900,
    headerCollapsed: false,
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    headerCollapsed: true,
  },
]

export interface Surface {
  locale: LocaleSurface
  theme: ThemeName
  viewport: ViewportSurface
}

/** Полное произведение матрицы — по одному тесту на комбинацию. */
export function allSurfaces(): Surface[] {
  return LOCALES.flatMap(locale =>
    THEMES.flatMap(theme =>
      VIEWPORTS.map(viewport => ({ locale, theme, viewport })),
    ),
  )
}

/** Человекочитаемая метка: попадает в имя теста и в сообщение об ошибке. */
export function surfaceLabel({ locale, theme, viewport }: Surface): string {
  return `${locale.code} · ${theme} · ${viewport.name} (${viewport.width}px)`
}

export function localeByCode(code: LocaleSurface['code']): LocaleSurface {
  const found = LOCALES.find(locale => locale.code === code)
  if (!found) throw new Error(`Unknown locale: ${code}`)
  return found
}

export function viewportByName(name: ViewportSurface['name']): ViewportSurface {
  const found = VIEWPORTS.find(viewport => viewport.name === name)
  if (!found) throw new Error(`Unknown viewport: ${name}`)
  return found
}

export const DESKTOP = viewportByName('desktop')
export const MOBILE = viewportByName('mobile')
