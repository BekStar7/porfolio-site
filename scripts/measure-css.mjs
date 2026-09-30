#!/usr/bin/env node
/**
 * Замер CSS-нагрузки статического сайта.
 *
 * Nuxt инлайнит стили компонентов в HTML и одновременно линкует CSS-файлы,
 * поэтому по одной только папке `_nuxt` картина неполная, и по одному HTML — тоже.
 * Для каждой страницы (`/` и `/en`) считаются:
 *   - linked  — файлы из <link rel="stylesheet">, каждый сжимается отдельно;
 *   - inlined — всё содержимое <style> из HTML, сжимается одним куском;
 *   - total   — linked + inlined.
 * Отдельно — все `_nuxt/*.css`, которые сборка вообще выпустила.
 * Размеры: raw, gzip (уровень 9), brotli (качество 11). Оба алгоритма детерминированы
 * при фиксированных параметрах, так что повторный запуск на том же коммите даёт те же байты.
 *
 * Запуск:
 *   pnpm measure:css                       собрать сайт, JSON в stdout, таблица в stderr
 *   pnpm measure:css --no-build            без сборки, по уже готовому .output/public
 *   pnpm measure:css --out <файл>          JSON в файл вместо stdout
 *   pnpm measure:css --compare <a> <b>     таблица «до / после» в Markdown; код 1 при росте gzip
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { gzipSync, brotliCompressSync, constants } from 'node:zlib'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(root, '.output/public')

/** Страницы, которые сайт пререндерит: маршрут → файл в .output/public. */
const PAGES = { '/': 'index.html', '/en': 'en/index.html' }
const MODES = ['raw', 'gzip', 'brotli']

const args = process.argv.slice(2)
const flag = name => args.includes(name)
const valueOf = name => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

/** Размеры строки или буфера во всех режимах сжатия. */
function sizes(data) {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8')
  return {
    raw: buf.length,
    gzip: gzipSync(buf, { level: 9 }).length,
    brotli: brotliCompressSync(buf, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

const sum = list =>
  Object.fromEntries(MODES.map(mode => [mode, list.reduce((n, item) => n + item[mode], 0)]))

/** Ссылки на стили и содержимое <style> из готового HTML. */
function extractCss(html) {
  const hrefs = []
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel=["']?stylesheet\b/i.test(tag)) continue
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1]
    if (href) hrefs.push(href)
  }
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1])
  return { hrefs, styles }
}

function measurePage(route, file) {
  const path = join(publicDir, file)
  if (!existsSync(path)) fail(`Нет ${path}. Соберите сайт: pnpm generate`)
  const { hrefs, styles } = extractCss(readFileSync(path, 'utf8'))

  const files = hrefs.map(href => {
    const cssPath = join(publicDir, new URL(href, 'http://local').pathname)
    if (!existsSync(cssPath)) fail(`Страница ${route} ссылается на ${href}, файла нет в сборке`)
    return { href, ...sizes(readFileSync(cssPath)) }
  })
  const linked = { ...sum(files), files }
  const inlined = { ...sizes(styles.join('\n')), blocks: styles.length }
  return { linked, inlined, total: sum([linked, inlined]) }
}

function measureEmitted() {
  const dir = join(publicDir, '_nuxt')
  const files = readdirSync(dir)
    .filter(name => name.endsWith('.css'))
    .sort()
    .map(name => ({ file: `_nuxt/${name}`, ...sizes(readFileSync(join(dir, name))) }))
  return { ...sum(files), files }
}

function gitSha() {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim() : 'unknown'
}

function build() {
  // stdout сборки уходит в stderr, иначе он испортит JSON в stdout
  const result = spawnSync('pnpm', ['generate'], { cwd: root, stdio: ['ignore', 2, 2] })
  if (result.status !== 0) fail('Сборка (pnpm generate) завершилась с ошибкой')
}

const bytes = n => `${n} B`

function printTable(report, out) {
  const rows = ['| страница | часть | raw | gzip | brotli |', '| --- | --- | ---: | ---: | ---: |']
  for (const [route, page] of Object.entries(report.pages)) {
    for (const part of ['linked', 'inlined', 'total']) {
      const m = page[part]
      rows.push(`| \`${route}\` | ${part} | ${bytes(m.raw)} | ${bytes(m.gzip)} | ${bytes(m.brotli)} |`)
    }
  }
  const e = report.emitted
  rows.push(`| все \`_nuxt/*.css\` | ${e.files.length} файл(ов) | ${bytes(e.raw)} | ${bytes(e.gzip)} | ${bytes(e.brotli)} |`)
  out.write(`commit ${report.sha}\n\n${rows.join('\n')}\n`)
}

const signed = n => (n > 0 ? `+${n}` : String(n))
const percent = (before, after) =>
  before === 0 ? '—' : `${signed(Number((((after - before) / before) * 100).toFixed(2)))}%`

/** Markdown-таблица «до / после»; возвращает true, если gzip-итог хоть одной страницы вырос. */
function compare(beforeFile, afterFile) {
  const before = JSON.parse(readFileSync(resolve(beforeFile), 'utf8'))
  const after = JSON.parse(readFileSync(resolve(afterFile), 'utf8'))
  const lines = [
    '# CSS: до и после',
    '',
    `До: \`${before.sha}\`  `,
    `После: \`${after.sha}\``,
    '',
    '| страница | часть | режим | до | после | Δ | Δ % |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: |',
  ]
  const regressions = []
  for (const route of Object.keys(before.pages)) {
    for (const part of ['linked', 'inlined', 'total']) {
      for (const mode of MODES) {
        const a = before.pages[route][part][mode]
        const b = after.pages[route][part][mode]
        lines.push(`| \`${route}\` | ${part} | ${mode} | ${a} | ${b} | ${signed(b - a)} | ${percent(a, b)} |`)
      }
    }
    const a = before.pages[route].total.gzip
    const b = after.pages[route].total.gzip
    if (b > a) regressions.push(`\`${route}\`: gzip ${a} → ${b} (${signed(b - a)} B)`)
  }
  for (const mode of MODES) {
    const a = before.emitted[mode]
    const b = after.emitted[mode]
    lines.push(`| все \`_nuxt/*.css\` | — | ${mode} | ${a} | ${b} | ${signed(b - a)} | ${percent(a, b)} |`)
  }
  lines.push('')
  if (regressions.length) {
    lines.push('**Регрессия:** gzip-итог linked + inlined вырос, миграция не считается завершённой.', '')
    for (const r of regressions) lines.push(`- ${r}`)
  } else {
    lines.push('Gzip-итог linked + inlined не превышает базовый ни на одной странице.')
  }
  process.stdout.write(`${lines.join('\n')}\n`)
  return regressions.length > 0
}

if (flag('--compare')) {
  const [a, b] = args.slice(args.indexOf('--compare') + 1)
  if (!a || !b) fail('Использование: --compare <до.json> <после.json>')
  process.exit(compare(a, b) ? 1 : 0)
}

if (!flag('--no-build')) build()

const report = {
  sha: gitSha(),
  pages: Object.fromEntries(Object.entries(PAGES).map(([route, file]) => [route, measurePage(route, file)])),
  emitted: measureEmitted(),
}

const out = valueOf('--out')
if (flag('--out') && !out) fail('Использование: --out <файл>')
const json = `${JSON.stringify(report, null, 2)}\n`
if (out) writeFileSync(resolve(out), json)
else process.stdout.write(json)
printTable(report, process.stderr)
