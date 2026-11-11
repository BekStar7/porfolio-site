// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

async function readClientAsset(dirs: { dir: string, baseURL?: string }[], href: string): Promise<string | null> {
  for (const { dir, baseURL = '/' } of dirs) {
    if (!href.startsWith(baseURL)) continue
    const css = await readFile(join(dir, href.slice(baseURL.length)), 'utf8').catch(() => null)
    if (css !== null) return css
  }
  return null
}

export default defineNuxtConfig({
  compatibilityDate: '2025-09-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  css: ['~/assets/css/main.css'],

  // Базовый URL сайта. Переопределяется переменной NUXT_PUBLIC_SITE_URL.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://bekstar.tech',
    // Имя сайта, которое Google показывает над ссылкой в выдаче
    name: 'Bexultan Karabayev',
  },

  app: {
    head: {
      // lang/dir проставляет @nuxtjs/i18n автоматически
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#0b0f14', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#fbfcfd', media: '(prefers-color-scheme: light)' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          // Тема применяется до первой отрисовки, иначе при тёмной теме
          // мелькнёт светлый фон. Скрипт крошечный и синхронный намеренно.
          innerHTML: `(function(){try{var k='portfolio-theme';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.dataset.theme=t;}catch(e){}})();`,
          tagPosition: 'head',
          tagPriority: 'critical',
        },
      ],
    },
  },

  i18n: {
    // Нужен, чтобы canonical и hreflang были абсолютными URL
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://bekstar.tech',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json', dir: 'ltr' },
    ],
    langDir: 'locales',
    defaultLocaleRouteNameSuffix: 'default',
    // Без автопереноса по языку браузера. Сайт статический, поэтому перенос
    // шёл уже в браузере: русскоязычный посетитель получал английский HTML,
    // Vue перерисовывал его на русский (ошибка гидратации), а Lighthouse и
    // Google видели canonical одной страницы на адресе другой. Язык выбирают
    // URL и переключатель в шапке.
    detectBrowserLanguage: false,
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700], subsets: ['latin', 'cyrillic'] },
    ],
    defaults: {
      // `swap` — текст виден сразу, без FOIT. Хорошо для CLS и Core Web Vitals.
      fallbacks: { 'sans-serif': ['-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'] },
    },
  },

  sitemap: {
    // hreflang-альтернативы добавляет интеграция с @nuxtjs/i18n
    autoI18n: true,
    xsl: false,
  },

  robots: {
    // Ничего не закрываем: Googlebot должен видеть JS и CSS,
    // иначе он отрендерит страницу неправильно и занизит её в выдаче.
    allow: ['/'],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      // sitemap и robots.txt регистрируют свои модули — здесь только страницы
      routes: ['/', '/ru'],
      failOnError: false,
      // /ru пишется как ru.html, а не ru/index.html. Иначе хостинг отвечает
      // на /ru редиректом на /ru/, хотя canonical, hreflang и sitemap
      // указывают на /ru без слэша.
      autoSubfolderIndex: false,
    },
  },

  hooks: {
    /**
     * Встраиваем глобальный CSS прямо в пререндеренный HTML. Стили компонентов
     * Nuxt встраивает сам, а `main.css` уходит отдельным <link> и блокирует
     * первую отрисовку: браузер ждёт файл, и только из него узнаёт о шрифтах.
     * Файлы маленькие (≈4 КБ gzip), лишний запрос стоит дороже.
     * Во время пререндера клиентские файлы ещё не скопированы в .output,
     * поэтому читаем их из исходных папок publicAssets.
     */
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:generate', async (route) => {
        if (typeof route.contents !== 'string' || !route.fileName?.endsWith('.html')) return
        const links = [...route.contents.matchAll(/<link rel="stylesheet" href="(\/_nuxt\/[^"]+\.css)"[^>]*>/g)]
        for (const [tag, href] of links) {
          const css = await readClientAsset(nitro.options.publicAssets, href!)
          if (css !== null) route.contents = route.contents.replace(tag, `<style>${css}</style>`)
        }
      })
    },
  },

  runtimeConfig: {
    public: {
      // Год фиксируется на сборке: Date в браузере дал бы расхождение
      // разметки при гидратации на стыке лет.
      buildYear: String(new Date().getFullYear()),
    },
  },

  typescript: {
    strict: true,
  },

  future: {
    compatibilityVersion: 4,
  },
})
