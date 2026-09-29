import type { Locator, Page } from '@playwright/test'

/**
 * Дерево доступности глазами браузера.
 *
 * `ariaSnapshotJSON` отдаёт то, что получилось после расчёта имён и ролей по
 * спецификации accname: `aria-hidden`-поддеревья уже выброшены, `aria-label`
 * и `.sr-only` уже учтены. Поэтому проверки ниже смотрят на имя из дерева, а
 * не на `textContent` — иначе они не заметили бы ни иконочную кнопку, ни
 * подпись, которую видит только скринридер.
 */

export interface AriaBox {
  x: number
  y: number
  width: number
  height: number
}

export interface AriaNode {
  role: string
  name?: string
  /** Уровень заголовка — есть только у `heading`. */
  level?: number
  url?: string
  box?: AriaBox
  /** Текстовые узлы приходят строками, а не объектами — отсюда union. */
  children?: (AriaNode | string)[]
}

/**
 * Роли, за которыми стоит действие пользователя. У каждой такой роли имя
 * обязательно: без него управляющий элемент объявляется как «кнопка» без
 * указания, что он делает.
 */
export const INTERACTIVE_ROLES: readonly string[] = [
  'button',
  'link',
  'checkbox',
  'radio',
  'switch',
  'tab',
  'menuitem',
  'combobox',
  'textbox',
  'slider',
  'spinbutton',
]

/** CSS-селектор фокусируемых элементов — по нему сверяется наличие в дереве. */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

interface SnapshotOptions {
  boxes?: boolean
}

function toNodes(snapshot: unknown): AriaNode[] {
  return (Array.isArray(snapshot) ? snapshot : [snapshot]) as AriaNode[]
}

/** Дерево доступности всей страницы. */
export async function ariaTree(page: Page, options: SnapshotOptions = {}): Promise<AriaNode[]> {
  return toNodes(await page.ariaSnapshotJSON(options))
}

/** Узел дерева для одного элемента — вместе с его вычисленным именем. */
export async function ariaNodeOf(
  locator: Locator,
  options: SnapshotOptions = {},
): Promise<AriaNode | undefined> {
  return toNodes(await locator.ariaSnapshotJSON(options))[0]
}

/**
 * Разворачивает дерево в плоский список в порядке документа. Текстовые
 * дети — строки, у них нет ни роли, ни имени, поэтому они отбрасываются.
 */
export function flattenAria(nodes: (AriaNode | string)[]): AriaNode[] {
  const flat: AriaNode[] = []
  const walk = (list: (AriaNode | string)[]) => {
    for (const node of list) {
      if (typeof node !== 'object' || node === null) continue
      flat.push(node)
      if (node.children) walk(node.children)
    }
  }
  walk(nodes)
  return flat
}

/** Все узлы указанной роли. */
export function nodesByRole(nodes: AriaNode[], role: string): AriaNode[] {
  return flattenAria(nodes).filter(node => node.role === role)
}

/** Короткий фрагмент разметки — чтобы в сообщении об ошибке был виден элемент. */
export async function describeElement(locator: Locator): Promise<string> {
  const html = await locator.evaluate(el => el.outerHTML)
  return html.replace(/\s+/g, ' ').slice(0, 160)
}
