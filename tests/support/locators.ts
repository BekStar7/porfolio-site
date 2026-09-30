import type { Locator, Page } from '@playwright/test'
import type { LocaleSurface } from './surfaces'
import { messages } from './messages'

/**
 * Поиск элементов так, как их находит вспомогательная технология: по роли и
 * доступному имени, потом по тексту и меткам, и только в последнюю очередь —
 * по `data-testid`. Классы, которые есть в разметке ради стилей, здесь и в
 * тестах не участвуют, поэтому любая перестройка стилей их не ломает.
 * Правила — в README, раздел «Как находить элементы в тестах».
 *
 * `data-testid` стоит только там, где семантической зацепки нет: у скрытого
 * визуально текста, у элемента, убранного из дерева доступности, и у
 * декоративного слоя. Сейчас их три: `brand-name`, `language-meter`,
 * `project-featured`.
 */

export type SectionId = 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact'

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/* ---- Шапка ---------------------------------------------------------- */

export const banner = (page: Page): Locator => page.getByRole('banner')

/** Ссылка-логотип — первая ссылка шапки. Skip-ссылка стоит до шапки. */
export const brandLink = (page: Page): Locator => banner(page).getByRole('link').first()

/** Имя рядом с монограммой. Ниже 62rem оно скрыто визуально, а не `display: none`. */
export const brandName = (page: Page): Locator => page.getByTestId('brand-name')

export const skipLink = (page: Page, locale: LocaleSurface): Locator =>
  page.getByRole('link', { name: messages(locale).a11y.skipToContent })

/**
 * Меню разделов. Ниже точки перелома оно свёрнуто в `display: none` и выпадает
 * из дерева доступности, а тесты как раз проверяют это, поэтому скрытые
 * элементы тут включены.
 */
export const siteNav = (page: Page, locale: LocaleSurface): Locator =>
  page.getByRole('navigation', { name: messages(locale).a11y.sectionsNav, includeHidden: true })

export const siteNavLinks = (page: Page, locale: LocaleSurface): Locator =>
  siteNav(page, locale).getByRole('link', { includeHidden: true })

export const siteNavLink = (page: Page, locale: LocaleSurface, id: string): Locator =>
  siteNav(page, locale).locator(`a[href="#${id}"]`)

export const currentNavLink = (page: Page, locale: LocaleSurface): Locator =>
  siteNav(page, locale).locator('a[aria-current]')

/** У бургера имя меняется («открыть» / «закрыть»), поэтому он найден по связи с меню. */
export const menuButton = (page: Page): Locator => page.locator('button[aria-controls="site-menu"]')

export const siteMenu = (page: Page): Locator => page.locator('#site-menu')

export const localeLinks = (page: Page, locale: LocaleSurface): Locator =>
  page.getByRole('navigation', { name: messages(locale).locale.label }).getByRole('link')

/**
 * Имя переключателя темы зависит от активной темы: в дереве всегда ровно одно
 * из двух. Поэтому ищем по любому из них.
 */
export const themeToggle = (page: Page, locale: LocaleSurface): Locator => {
  const { toLight, toDark } = messages(locale).theme
  return page.getByRole('button', { name: new RegExp(`${escapeRegExp(toLight)}|${escapeRegExp(toDark)}`) })
}

/* ---- Подвал --------------------------------------------------------- */

/** В подвале единственная ссылка — «Наверх». */
export const backToTop = (page: Page): Locator => page.getByRole('contentinfo').getByRole('link')

/* ---- Разделы -------------------------------------------------------- */

/** Раздел страницы по названию его заголовка — точное совпадение, чтобы «Опыт» не цеплял «Опыт до фронтенда». */
export const section = (page: Page, locale: LocaleSurface, id: SectionId): Locator =>
  page.getByRole('region', { name: messages(locale).sections[id], exact: true })

/** Первый раздел, без заголовка в списке разделов: его название — сам `h1`. */
export const hero = (page: Page): Locator =>
  page.getByRole('region').filter({ has: page.getByRole('heading', { level: 1 }) })

export const languageMeters = (page: Page): Locator => page.getByTestId('language-meter')

export const featuredProject = (page: Page): Locator => page.getByTestId('project-featured')

/** Карточка проекта — `<article>` в разделе проектов. */
export const projectCards = (page: Page, locale: LocaleSurface): Locator =>
  section(page, locale, 'projects').getByRole('article')

/** Все декоративные иконки: они единственные `<svg>` на странице. */
export const icons = (page: Page): Locator => page.locator('svg')

/**
 * Управляющие элементы-кнопки в основной части: призывы в первом экране,
 * ссылки проектов и действия в контактах. Ссылки внутри текста и соцсети
 * сюда не входят — это не отдельные кнопки. Соцсети — элементы списка, а строка
 * действий в контактах — нет, чем `:not(li a)` и отделяет адрес-кнопку от
 * ссылки на ту же почту среди соцсетей.
 */
export const callToActionControls = (page: Page, locale: LocaleSurface): Locator =>
  page.locator('main a[href="#contact"], main a[href="#projects"]')
    .or(section(page, locale, 'projects').getByRole('link'))
    .or(section(page, locale, 'contact').locator('a[href^="mailto:"]:not(li a)'))
    .or(section(page, locale, 'contact').getByRole('button'))
