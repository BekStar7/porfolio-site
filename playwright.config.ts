import { defineConfig, devices } from '@playwright/test'

/**
 * Конфигурация доступностных проверок.
 *
 * Тесты идут против production-сборки, а не dev-сервера: dev подмешивает
 * HMR-клиент и Nuxt devtools, которых нет в проде. Их разметка дала бы и
 * ложные срабатывания axe, и обратное — dev-стили могут замаскировать
 * реальную проблему. `nuxt preview` отдаёт ровно то, что увидит пользователь.
 */

/**
 * Свой порт, не тот, на котором обычно живёт `nuxt dev`. Переиспользование
 * сервера по порту 3000 подхватило бы запущенный dev-сервер вместе с его
 * devtools-фреймом — а он валит сканирование на контрасте внутри самого
 * фрейма. Отдельный порт разводит эти два мира: dev остаётся нетронутым,
 * а тесты всегда смотрят на собранный вывод.
 */
const PORT = 3100
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    // Скриншоты и видео не нужны: утверждения идут по дереву доступности
    // и геометрии, а не по картинке.
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
    command: `pnpm build && pnpm preview --port ${PORT}`,
    url: BASE_URL,
    // Локально переиспользуем preview, оставшийся от прошлого прогона на этом
    // же порту — иначе каждый запуск платит полной сборкой. В CI собираем
    // с нуля всегда.
    reuseExistingServer: !process.env.CI,
    // Сборка Nuxt на холодном кеше идёт заметно дольше дефолтных 60 секунд
    timeout: 300_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
