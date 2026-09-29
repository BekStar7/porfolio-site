import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { LocaleSurface } from './surfaces'

/**
 * Переводы читаются из тех же файлов, что и у приложения.
 *
 * Иначе проверка имени свелась бы к тавтологии: взять текст из элемента и
 * сверить его с текстом из того же элемента. С файлом локали тест сравнивает
 * страницу с источником правды — и замечает, если подпись не доехала до
 * дерева доступности (например, её скрыли `display: none`).
 *
 * Читаем файл, а не `import ... with { type: 'json' }`: так модуль остаётся
 * обычным TS без зависимости от того, как раннер обрабатывает JSON-импорты.
 */

export interface Messages {
  a11y: {
    skipToContent: string
    opensInNewTab: string
    mainNav: string
    socialLinks: string
    backToTop: string
    sectionsNav: string
  }
  nav: Record<string, string>
  theme: { toLight: string, toDark: string }
  locale: { label: string, current: string }
  contact: Record<string, string>
}

function load(code: LocaleSurface['code']): Messages {
  const path = fileURLToPath(new URL(`../../i18n/locales/${code}.json`, import.meta.url))
  return JSON.parse(readFileSync(path, 'utf8')) as Messages
}

const MESSAGES: Record<LocaleSurface['code'], Messages> = {
  ru: load('ru'),
  en: load('en'),
}

export function messages(locale: LocaleSurface): Messages {
  return MESSAGES[locale.code]
}
