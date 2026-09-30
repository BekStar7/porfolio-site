import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
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

  vite: {
    plugins: [tailwindcss()],
    css: {
      modules: {
        // Имя класса из модуля — хеш от пути файла и локального имени, а не от
        // содержимого: сборка остаётся детерминированной, а хеши не меняются
        // от правки стилей.
        generateScopedName: '[hash:base64:6]',
      },
    },
  },

  // В dev имена читаются в devtools: `HeroSection-module_glow`
  $development: {
    vite: {
      css: {
        modules: { generateScopedName: '[name]_[local]' },
      },
    },
  },

  // Базовый URL сайта. Переопределяется переменной NUXT_PUBLIC_SITE_URL.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    name: 'Portfolio',
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
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
    strategy: 'prefix_except_default',
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
    ],
    langDir: 'locales',
    defaultLocaleRouteNameSuffix: 'default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'ru',
    },
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
      routes: ['/', '/en'],
      failOnError: false,
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
