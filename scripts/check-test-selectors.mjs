#!/usr/bin/env node
/**
 * Защита от селекторов по классам в тестах.
 *
 * Классы в разметке существуют ради стилей и меняются вместе с ними. Тест,
 * привязанный к классу, ломается от перестройки вёрстки, хотя поведение
 * страницы то же. Поэтому в `tests/` элементы ищутся по роли и имени, по метке
 * или тексту, а если зацепки нет — по `data-testid`.
 *
 * Скрипт разбирает файлы как TypeScript и смотрит только на строки в коде:
 * комментарии и регулярные выражения не в счёт. Ищет:
 *   - в любой строке — селектор класса в начале или после разделителя (`.foo`,
 *     `ul > .foo`, `a, .foo`);
 *   - в первом аргументе `locator()`, `querySelector()`, `$$eval()` и подобных —
 *     ещё и `tag.foo` и `[class=…]`.
 *
 * Запускается перед Playwright в `pnpm test:a11y`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, relative, extname } from 'node:path'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const testsDir = resolve(root, 'tests')

const CLASS_SELECTOR = /(^|[\s,>+~(\[])\.[A-Za-z_][\w-]*/
const TAG_CLASS = /(^|[\s,>+~(\[])[a-z][\w-]*\.[A-Za-z_][\w-]*/
const CLASS_ATTRIBUTE = /\[class\s*[*^$~|]?=/

/** Методы, чей первый аргумент — CSS-селектор. */
const SELECTOR_CALLS = new Set([
  'locator', 'querySelector', 'querySelectorAll', '$', '$$', '$eval', '$$eval',
  'closest', 'matches', 'waitForSelector',
])

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (extname(path) === '.ts') yield path
  }
}

const isStringPart = node =>
  ts.isStringLiteral(node)
  || ts.isNoSubstitutionTemplateLiteral(node)
  || ts.isTemplateHead(node)
  || ts.isTemplateMiddle(node)
  || ts.isTemplateTail(node)

/** Строка — первый аргумент вызова вроде `page.locator(...)`? Для шаблона — его голова. */
function isSelectorArgument(node) {
  const literal = ts.isTemplateHead(node) ? node.parent : node
  const call = literal.parent
  if (!call || !ts.isCallExpression(call) || call.arguments[0] !== literal) return false
  const callee = call.expression
  const name = ts.isPropertyAccessExpression(callee) ? callee.name.text : ts.isIdentifier(callee) ? callee.text : ''
  return SELECTOR_CALLS.has(name)
}

const problems = []

for (const path of walk(testsDir)) {
  const source = readFileSync(path, 'utf8')
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true)

  const visit = (node) => {
    if (isStringPart(node)) {
      // Середина и хвост шаблона идут сразу за `${…}`: начала строки там нет,
      // и `${name}.json` не должен читаться как селектор `.json`
      const text = (ts.isTemplateMiddle(node) || ts.isTemplateTail(node) ? 'x' : '') + node.text
      const inSelectorCall = isSelectorArgument(node)
      const match = text.match(CLASS_SELECTOR)
        ?? (inSelectorCall ? text.match(TAG_CLASS) ?? text.match(CLASS_ATTRIBUTE) : null)

      if (match) {
        const { line } = file.getLineAndCharacterOfPosition(node.getStart())
        problems.push({ file: relative(root, path), line: line + 1, text: text.trim().slice(0, 80) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
}

if (!problems.length) {
  console.log('Селекторы тестов: классов нет.')
  process.exit(0)
}

for (const { file, line, text } of problems) {
  console.log(`${file}:${line}  селектор по классу: "${text}"`)
}
console.log(
  '\nТесты не должны искать элементы по классам стилей. Ищите по роли и имени, затем по метке или тексту,\n'
  + 'и только без семантической зацепки — по data-testid. Правила: README.md, раздел «Как находить элементы в тестах».',
)
process.exit(1)
