#!/usr/bin/env node
/**
 * Проверка контраста по WCAG 2.2 AA.
 *
 * Токены читаются прямо из app/assets/css/main.css, поэтому проверка
 * не разъедется с реальной палитрой. Полупрозрачные слои (свечение в hero,
 * акцентная подложка карточек) накладываются на базовый фон — автоматические
 * проверки вроде axe такие фоны вычислить не могут и помечают как «не определено».
 *
 * Запуск: pnpm check:contrast
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(resolve(root, 'app/assets/css/main.css'), 'utf8')

/** Порог для обычного текста, крупного текста (>=24px или >=18.66px bold) и элементов интерфейса. */
const AA_TEXT = 4.5
const AA_LARGE = 3
const AA_UI = 3

const hex = h => h.replace('#', '').match(/../g).map(x => parseInt(x, 16))
const channel = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
const luminance = rgb => { const [r, g, b] = rgb.map(channel); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const blend = (fg, alpha, bg) => fg.map((c, i) => Math.round(alpha * c + (1 - alpha) * bg[i]))
const fmt = rgb => '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('')

/** Достаёт значение токена из нужного блока темы. */
function token(themeSelector, name) {
  const block = css.split(themeSelector)[1]?.split('}')[0] ?? ''
  const match = block.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!match) throw new Error(`Не найден токен --${name} в блоке ${themeSelector}`)
  return hex(match[1])
}

const themes = {
  DARK: {
    selector: ":root[data-theme='dark'] {",
    glowAlpha: 0.14,
    veilAlpha: 0.12,
  },
  LIGHT: {
    selector: ":root[data-theme='light'] {",
    glowAlpha: 0.08,
    veilAlpha: 0.09,
  },
}

let failures = 0

for (const [name, { selector, glowAlpha, veilAlpha }] of Object.entries(themes)) {
  const t = Object.fromEntries(
    ['bg', 'surface', 'surface-2', 'text', 'text-muted', 'text-subtle', 'accent', 'accent-contrast', 'border-interactive']
      .map(key => [key, token(selector, key)]),
  )

  const backgrounds = {
    'фон страницы': t.bg,
    'карточка': t.surface,
    'вложенная плашка': t['surface-2'],
    'hero + свечение': blend(t.accent, glowAlpha, t.bg),
    'карточка + акцент': blend(t.accent, veilAlpha, t.surface),
  }

  console.log(`\n═══ ${name} ═══`)

  for (const [bgName, bg] of Object.entries(backgrounds)) {
    console.log(`\n  ${bgName} (${fmt(bg)})`)

    const checks = [
      ['основной текст', t.text, AA_TEXT],
      ['вторичный текст', t['text-muted'], AA_TEXT],
      ['третичный текст', t['text-subtle'], AA_TEXT],
      ['ссылка / акцент', t.accent, AA_TEXT],
      ['граница интерактивного элемента', t['border-interactive'], AA_UI],
    ]

    for (const [label, color, min] of checks) {
      const ratio = contrast(color, bg)
      const ok = ratio >= min
      if (!ok) failures++
      console.log(`    ${ok ? '✓' : '✗'} ${ratio.toFixed(2).padStart(6)} : ${min.toFixed(1)}  ${label}`)
    }
  }

  const onAccent = contrast(t['accent-contrast'], t.accent)
  const okAccent = onAccent >= AA_TEXT
  if (!okAccent) failures++
  console.log(`\n  кнопка на акценте (${fmt(t.accent)})`)
  console.log(`    ${okAccent ? '✓' : '✗'} ${onAccent.toFixed(2).padStart(6)} : ${AA_TEXT.toFixed(1)}  текст на заливке`)
}

console.log(
  failures
    ? `\n✗ Не проходят проверку: ${failures}\n`
    : '\n✓ Все сочетания проходят WCAG 2.2 AA\n',
)
process.exit(failures ? 1 : 0)
