import type { BrowserContext, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import type { LocaleSurface, Surface, ThemeName } from './surfaces'

/**
 * Ключ, под которым тема лежит в localStorage. Дублирует
 * `app/composables/useTheme.ts` намеренно: тест не должен импортировать
 * код приложения, иначе он перестанет быть внешней проверкой.
 */
export const THEME_STORAGE_KEY = 'portfolio-theme'

/** Кука, по которой @nuxtjs/i18n понимает, что локаль уже выбрана. */
export const LOCALE_COOKIE = 'i18n_redirected'

/**
 * Тема применяется синхронным скриптом в <head> ещё до первой отрисовки,
 * а не Vue. Поэтому задать её детерминированно можно только одним способом:
 * положить значение в localStorage раньше, чем выполнится любой скрипт
 * страницы. `addInitScript` делает ровно это.
 */
export async function seedTheme(page: Page, theme: ThemeName): Promise<void> {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key!, value!),
    [THEME_STORAGE_KEY, theme],
  )
}

/**
 * `detectBrowserLanguage` с `redirectOn: 'root'` может увести с `/` на `/en`.
 * Заранее выставленная кука говорит, что выбор уже сделан — это снимает
 * редирект, а не соревнуется с ним.
 */
export async function pinLocale(
  context: BrowserContext,
  locale: LocaleSurface,
  baseURL: string,
): Promise<void> {
  await context.addCookies([
    { name: LOCALE_COOKIE, value: locale.code, url: baseURL },
  ])
}

/**
 * Ждём конца гидратации: Vue при `mount()` вешает `__vue_app__` на корневой
 * контейнер. До этого момента обработчики кликов ещё не навешаны, и тест,
 * нажимающий кнопку, был бы флаки.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt')
    return !!root && '__vue_app__' in root
  })
}

export interface OpenSurfaceOptions {
  /** Свернуть анимации: нужно там, где утверждения идут по геометрии. */
  reducedMotion?: boolean
}

/**
 * Открывает одну поверхность матрицы: ширина, тема, локаль, затем переход
 * и ожидание гидратации. Возвращает управление, когда страница готова к
 * проверкам.
 */
export async function openSurface(
  page: Page,
  surface: Surface,
  baseURL: string,
  options: OpenSurfaceOptions = {},
): Promise<void> {
  const { locale, theme, viewport } = surface

  await page.setViewportSize({ width: viewport.width, height: viewport.height })
  await pinLocale(page.context(), locale, baseURL)
  await seedTheme(page, theme)

  if (options.reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' })

  await page.goto(locale.path)
  await waitForHydration(page)

  // Тема должна быть уже применена к первой отрисовке — если нет, дальнейшие
  // проверки контраста и видимости фокуса смотрели бы не на ту палитру.
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
}

/** Высота залипающей шапки — с ней сравнивается положение фокуса. */
export async function headerBox(page: Page) {
  const box = await page.locator('header').first().boundingBox()
  if (!box) throw new Error('Header has no bounding box — is it rendered?')
  return box
}

/**
 * Два прямоугольника пересекаются? Используется для 2.4.11: элемент в фокусе
 * не должен уходить под шапку.
 */
export function intersects(
  a: { x: number, y: number, width: number, height: number },
  b: { x: number, y: number, width: number, height: number },
): boolean {
  return (
    a.x < b.x + b.width
    && b.x < a.x + a.width
    && a.y < b.y + b.height
    && b.y < a.y + a.height
  )
}

/**
 * Ждём, пока прокрутка встанет: два одинаковых замера подряд означают, что
 * плавный скролл закончился. Фиксированная задержка тут была бы гонкой.
 */
export async function waitForScrollToSettle(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const w = window as unknown as { __lastScrollY?: number }
    const current = Math.round(window.scrollY)
    const settled = w.__lastScrollY === current
    w.__lastScrollY = current
    return settled
  }, undefined, { polling: 100 })
  await page.evaluate(() => {
    delete (window as unknown as { __lastScrollY?: number }).__lastScrollY
  })
}
