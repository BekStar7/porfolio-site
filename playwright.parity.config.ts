import { defineConfig, devices } from '@playwright/test'

/**
 * Проверка визуального паритета на время миграции стилей.
 *
 * Это временный инструмент: скриншоты сравниваются с эталонами, снятыми с уже
 * нормализованного по сетке 4px сайта, и удаляются вместе с этой конфигурацией
 * перед слиянием. Долгоживущая проверка доступности (`playwright.config.ts`)
 * скриншотов намеренно не использует.
 *
 * Тесты лежат в `scripts/parity/`, вне `tests/`, поэтому `pnpm test:a11y`
 * их не видит.
 *
 * Запуск: pnpm exec playwright test -c playwright.parity.config.ts
 * Другая папка эталонов (например, для снимков «до нормализации»):
 *   PARITY_SNAPSHOT_DIR=/путь pnpm exec playwright test -c playwright.parity.config.ts
 */

/** Свой порт: рядом могут работать `nuxt dev` (3000) и проверка доступности (3100). */
const PORT = 3101
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './scripts/parity',
  outputDir: './test-results/parity',

  // Эталоны — просто файлы по имени, без суффикса платформы: снимаются и
  // сверяются на одной машине одним и тем же Chromium.
  snapshotDir: process.env.PARITY_SNAPSHOT_DIR ?? './scripts/parity/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',

  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [['list']],

  expect: {
    toHaveScreenshot: {
      // Допуск на сглаживание шрифтов, но не на сдвиг раскладки. На одной машине и
      // одном Chromium сборки одного кода дают одни и те же пиксели, поэтому для
      // строгой сверки допуск можно занулить: PARITY_TOLERANCE=0
      maxDiffPixelRatio: Number(process.env.PARITY_TOLERANCE ?? 0.001),
      animations: 'disabled',
    },
  },

  use: {
    baseURL: BASE_URL,
    screenshot: 'off',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `nuxt preview` уходит в отдельную группу процессов, и Playwright после прогона
    // не может его остановить: зависший сервер держит канал stderr, и прогон не
    // завершается. Собранный сервер запускается напрямую — `exec` оболочки
    // подменяет её на node, и остановка убивает именно его.
    command: `pnpm build && PORT=${PORT} node .output/server/index.mjs`,
    url: BASE_URL,
    // Устаревший preview от прошлой сборки дал бы скриншоты не того кода
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
