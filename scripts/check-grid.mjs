#!/usr/bin/env node
/**
 * Проверка сетки 4px.
 *
 * Каждый padding, margin, gap, inset и размер (width/height, min-/max-) в стилях
 * приложения обязан быть кратен 4px (0.25rem) или относиться к исключениям:
 *   - линии в 1–2px (границы, разделители, декоративные полоски);
 *   - fluid-токены `clamp()`;
 *   - значения в `ch`, `%`, `em`, `vw` и т. п. — проверяются только `rem` и `px`;
 *   - токены `--container` и `--measure` (в декларациях они идут через var()).
 *
 * Смотрит `<style>` в .vue, .css и .scss в `app/`, а также произвольные значения
 * утилит в шаблонах вроде `gap-[0.35rem]`.
 *
 * Запуск: node scripts/check-grid.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join, relative, extname } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const appDir = resolve(root, 'app')

const STEP = 4
const ROOT_FONT_PX = 16
const HAIRLINE_PX = 2

const SIDES = '(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?'
const PROPERTY = new RegExp(
  `^(?:padding${SIDES}|margin${SIDES}|inset${SIDES}|gap|row-gap|column-gap|top|right|bottom|left|`
  + '(?:min-|max-)?(?:width|height|inline-size|block-size))$',
)

// Утилиты Tailwind с произвольным значением: `gap-[0.35rem]`, `-mt-[7px]`, `min-h-[46px]`
const UTILITY = /(?<![\w-])(-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|start|end|size|(?:min-|max-)?[wh]|basis))-\[(-?[\d.]+(?:px|rem))\]/g

/** Файлы стилей: .css/.scss целиком, у .vue — только содержимое <style>. */
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* walk(path)
    else yield path
  }
}

/** Заменяет комментарии пробелами, сохраняя смещения — номера строк не плывут. */
const blank = text => text.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))

/** Убирает вложенные `clamp(...)`, оставляя длину строки прежней. */
function stripClamp(value) {
  let out = ''
  for (let i = 0; i < value.length; i++) {
    if (value.startsWith('clamp(', i)) {
      let depth = 0
      let j = i + 5
      for (; j < value.length; j++) {
        if (value[j] === '(') depth++
        else if (value[j] === ')' && --depth === 0) break
      }
      out += ' '.repeat(j - i + 1)
      i = j
    }
    else out += value[i]
  }
  return out
}

const toPx = (amount, unit) => amount * (unit === 'rem' ? ROOT_FONT_PX : 1)
const offGrid = px => Math.abs(px) > HAIRLINE_PX && Math.abs(px % STEP) > 1e-9

/** Длины в `rem`/`px`, не лежащие на сетке. */
function offGridLengths(value) {
  const found = []
  for (const [, amount, unit] of stripClamp(value).matchAll(/(-?\d*\.?\d+)(rem|px)\b/g)) {
    const px = toPx(Number(amount), unit)
    if (offGrid(px)) found.push(`${amount}${unit} (${Number(px.toFixed(2))}px)`)
  }
  return found
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length

const problems = []

function scanStyles(file, css, firstLine) {
  const text = blank(css)
  for (const match of text.matchAll(/(?:^|[;{}])\s*([a-z-]+)\s*:\s*([^;{}]*)/g)) {
    const [, property, value] = match
    if (!PROPERTY.test(property)) continue
    const bad = offGridLengths(value)
    if (bad.length) {
      const line = firstLine + lineOf(text, match.index + match[0].indexOf(property)) - 1
      problems.push({ file, line, what: `${property}: ${value.trim()}`, bad })
    }
  }
}

function scanTemplate(file, source) {
  const template = source.replace(/<style[\s\S]*?<\/style>/g, m => m.replace(/[^\n]/g, ' '))
  for (const match of template.matchAll(UTILITY)) {
    const [, utility, value] = match
    const [amount, unit] = value.match(/(-?[\d.]+)(px|rem)/).slice(1)
    if (offGrid(toPx(Number(amount), unit))) {
      problems.push({
        file,
        line: lineOf(template, match.index),
        what: match[0],
        bad: [`${value} (${utility})`],
      })
    }
  }
}

for (const path of walk(appDir)) {
  const ext = extname(path)
  if (!['.vue', '.css', '.scss'].includes(ext)) continue
  const file = relative(root, path)
  const source = readFileSync(path, 'utf8')

  if (ext === '.vue') {
    for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
      const body = match[1]
      const bodyStart = match.index + match[0].indexOf('>') + 1
      scanStyles(file, body, lineOf(source, bodyStart))
    }
    scanTemplate(file, source)
  }
  else scanStyles(file, source, 1)
}

if (!problems.length) {
  console.log('Сетка 4px: отклонений нет.')
  process.exit(0)
}

for (const { file, line, what, bad } of problems) {
  console.log(`${file}:${line}  ${what}  →  вне сетки: ${bad.join(', ')}`)
}
console.log(`\nВне сетки 4px: ${problems.length} деклараци${problems.length === 1 ? 'я' : 'й'}.`)
process.exit(1)
