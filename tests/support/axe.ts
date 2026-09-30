import AxeBuilder from '@axe-core/playwright'
import type { Page, TestInfo } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Теги axe, покрывающие WCAG 2.2 уровней A и AA. 2.2 добавила критерии
 * поверх 2.1, поэтому нужны все предыдущие наборы, а не только последний.
 */
export const WCAG_22_AA_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
] as const

export interface AxeNode {
  target: string[]
  html: string
  failureSummary?: string
}

export interface AxeResult {
  id: string
  impact?: string | null
  help: string
  helpUrl: string
  nodes: AxeNode[]
}

/**
 * Прогоняет axe по всему документу. Ничего не исключаем: ни элементов,
 * ни правил — иначе проверка перестала бы отвечать на вопрос «есть ли
 * нарушения на странице».
 */
export async function analyze(page: Page) {
  return new AxeBuilder({ page }).withTags([...WCAG_22_AA_TAGS]).analyze()
}

/**
 * Разворачивает нарушения в сообщение, по которому можно починить проблему,
 * не перезапуская сканирование руками: правило, его серьёзность, ссылка на
 * описание и селектор каждого виновного элемента.
 */
export function formatViolations(violations: AxeResult[], label: string): string {
  const lines = [`${violations.length} accessibility violation(s) on ${label}:`]

  for (const violation of violations) {
    lines.push('')
    lines.push(`  [${violation.impact ?? 'unknown'}] ${violation.id} — ${violation.help}`)
    lines.push(`  ${violation.helpUrl}`)
    for (const node of violation.nodes) {
      lines.push(`    selector: ${node.target.join(' ')}`)
      lines.push(`    html:     ${node.html.slice(0, 200)}`)
      if (node.failureSummary) {
        lines.push(`    why:      ${node.failureSummary.replace(/\n/g, ' ')}`)
      }
    }
  }

  return lines.join('\n')
}

/**
 * Сканирует страницу и падает при любом нарушении. `label` описывает
 * поверхность (локаль · тема · ширина) и попадает и в имя теста, и в текст
 * ошибки — без него непонятно, какая из комбинаций сломалась.
 *
 * Результаты `incomplete` прикладываются к отчёту, но не валят прогон:
 * axe не умеет считать контраст поверх полупрозрачных слоёв, и именно для
 * них существует `pnpm check:contrast`. Рост этого списка проверяется
 * отдельно — см. `tests/a11y/contrast-baseline.spec.ts`.
 */
export async function expectNoViolations(
  page: Page,
  label: string,
  testInfo: TestInfo,
): Promise<void> {
  const results = await analyze(page)

  if (results.incomplete.length) {
    await testInfo.attach(`axe-incomplete-${label}.json`, {
      body: JSON.stringify(results.incomplete, null, 2),
      contentType: 'application/json',
    })
  }

  expect(
    results.violations,
    formatViolations(results.violations as AxeResult[], label),
  ).toEqual([])
}

/**
 * Селекторы axe для узлов, по которым он не смог посчитать контраст.
 *
 * Сами по себе они непригодны как ключ базы: в них попадают хеши стилей
 * компонентов, позиции `:nth-child` и значения содержимого — даты, адрес
 * почты. Поэтому здесь они только возвращаются как есть, а тест сам находит
 * элемент по селектору и смотрит, в какой области страницы он лежит. Причина
 * «incomplete» — полупрозрачный слой под узлом, а не сам узел, и области
 * страницы соответствуют слоям, а не классам, которые их рисуют.
 */
export async function incompleteContrastTargets(page: Page): Promise<string[]> {
  const results = await analyze(page)
  return results.incomplete
    .filter(result => result.id === 'color-contrast')
    .flatMap(result => result.nodes.map(node => node.target[0]))
    .filter((selector): selector is string => typeof selector === 'string')
}
