import type { Profile } from '~~/shared/types/profile'

/**
 * Единственный источник контента сайта.
 * Правьте только этот файл — вёрстка, SEO-разметка и JSON-LD обновятся сами.
 */
export const profile: Profile = {
  name: {
    ru: 'Бексултан Карабаев',
    en: 'Bexultan Karabayev',
  },
  role: {
    ru: 'Senior Frontend Engineer',
    en: 'Senior Frontend Engineer',
  },
  tagline: {
    ru: 'Собираю высоконагруженные веб-продукты на Vue 3 / Nuxt и React / TypeScript — и архитектуру, которая переживает рост команды.',
    en: 'I build high-load web products with Vue 3 / Nuxt and React / TypeScript — and the architecture that survives a growing team.',
  },
  location: {
    ru: 'Алматы, Казахстан',
    en: 'Almaty, Kazakhstan',
  },
  availability: {
    ru: 'Открыт к предложениям · Удалённо',
    en: 'Open to opportunities · Remote',
  },

  email: 'bekstar37@gmail.com',

  // Телефон из резюме (+7 700 570 3291) намеренно не публикуется:
  // открытый номер на сайте быстро собирают спам-боты.
  // Если он нужен — добавьте сюда объект вида
  // { id: 'phone', icon: 'phone', label: 'Телефон', handle: '+7 700 570 3291', href: 'tel:+77005703291' }
  socials: [
    {
      id: 'github',
      icon: 'github',
      label: 'GitHub',
      handle: 'github.com/BekStar7',
      href: 'https://github.com/BekStar7',
    },
    {
      id: 'linkedin',
      icon: 'linkedin',
      label: 'LinkedIn',
      handle: 'in/bexultan-karabayev',
      href: 'https://www.linkedin.com/in/bexultan-karabayev',
    },
    {
      id: 'email',
      icon: 'mail',
      label: 'Email',
      handle: 'bekstar37@gmail.com',
      href: 'mailto:bekstar37@gmail.com',
    },
  ],

  stats: [
    {
      id: 'years',
      value: '9',
      label: { ru: 'лет в коммерческой разработке', en: 'years in professional development' },
    },
    {
      id: 'mau',
      value: { ru: '1,5 млн', en: '1.5M' },
      label: { ru: 'MAU у продукта, который развивал', en: 'MAU on the product I helped build' },
    },
    {
      id: 'experiments',
      value: '100+',
      label: { ru: 'A/B-тестов доведено до прода', en: 'A/B tests shipped to production' },
    },
    {
      id: 'migration',
      value: { ru: '433 тыс.', en: '433K' },
      label: { ru: 'строк кода переведено на FSD', en: 'lines of code migrated to FSD' },
    },
  ],

  about: {
    ru: [
      'Senior Frontend Engineer с девятью годами опыта. Делаю высоконагруженные веб-продукты — от крупнейшего в Казахстане маркетплейса недвижимости Krisha.kz (~1,5 млн MAU) до мультиязычной EdTech-платформы.',
      'В разработку пришёл не сразу: начинал эникейщиком в турфирме, потом работал в Service Desk «Казпочты» и собирался стать системным администратором. На курсах понял, что визуальная часть веба интересует меня сильнее, — и ушёл во frontend.',
      'Сейчас специализируюсь на Vue 3 / Nuxt и React / TypeScript: перевожу легаси на масштабируемые архитектуры (Feature-Sliced Design, SSR), собираю дизайн-системы уровня компании и выстраиваю процесс вокруг данных — A/B-тесты, мониторинг ошибок, E2E-тесты в CI.',
      'Люблю владеть архитектурой фронтенда целиком, а не отдельным экраном, и растить команду вокруг неё.',
    ],
    en: [
      'Senior Frontend Engineer with nine years of experience building high-load web products — from Kazakhstan’s largest real-estate marketplace, Krisha.kz (~1.5M MAU), to a multi-language EdTech platform.',
      'I did not start out in engineering. I was the IT generalist at a travel agency, then worked Service Desk at Kazpost, heading for a sysadmin career. A course along the way showed me I cared far more about the visual side of the web — so I moved into frontend.',
      'Today I work in Vue 3 / Nuxt and React / TypeScript: migrating legacy codebases to scalable architectures (Feature-Sliced Design, SSR), building company-wide design systems, and wiring the process around data — A/B tests, error monitoring and E2E tests in CI.',
      'I like owning frontend architecture end to end rather than a single screen, and growing the team around it.',
    ],
  },

  quote: {
    text: {
      ru: 'Обожаю frontend за то, что он всегда подкидывает новые сюрпризы и бросает вызовы.',
      en: 'I love frontend because it never stops throwing new surprises and challenges at you.',
    },
    context: {
      ru: 'из интервью weproject.media, 2022',
      en: 'from an interview with weproject.media, 2022',
    },
    href: 'https://weproject.media/articles/detail/kak-smenit-professiyu-i-stat-razrabotchikom-opyt-sotrudnikov-kolesa-group/',
  },

  skills: [
    {
      id: 'frontend',
      title: { ru: 'Frontend', en: 'Frontend' },
      items: ['Vue 3', 'Nuxt', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS Modules', 'Tailwind CSS'],
    },
    {
      id: 'state',
      title: { ru: 'Управление состоянием', en: 'State management' },
      items: ['Pinia', 'Vuex', 'Redux Toolkit', 'MobX'],
    },
    {
      id: 'architecture',
      title: { ru: 'Архитектура', en: 'Architecture' },
      items: ['Feature-Sliced Design', 'SSR / SSG', 'Design Systems', 'Component Libraries', 'Storybook'],
    },
    {
      id: 'quality',
      title: { ru: 'Тестирование и качество', en: 'Testing & quality' },
      items: ['Playwright', 'Vitest', 'E2E Testing', 'Sentry', 'CI/CD'],
    },
    {
      id: 'tooling',
      title: { ru: 'Инструменты и инфраструктура', en: 'Tooling & infrastructure' },
      items: ['Vite', 'Webpack', 'Node.js', 'Docker', 'Nginx', 'GitHub Actions', 'Vercel', 'AWS Route 53'],
    },
    {
      id: 'product',
      title: { ru: 'Продукт и данные', en: 'Product & data' },
      items: ['A/B Testing (Statsig)', 'Amplitude', 'REST', 'WebSockets'],
    },
    {
      id: 'ai',
      title: { ru: 'AI-инструменты', en: 'AI tooling' },
      items: ['Claude Code', 'OpenAI API'],
    },
  ],

  experience: [
    {
      id: 'zimran',
      company: 'Zimran',
      note: 'EdTech',
      location: { ru: 'Удалённо', en: 'Remote' },
      roles: [
        {
          title: { ru: 'Web Team Lead', en: 'Web Team Lead' },
          start: '2026-02',
          end: '2026-08',
          highlights: {
            ru: [
              'Отвечал за архитектуру фронтенда EdTech-платформы, оставаясь играющим тимлидом: продакшен-код каждый день.',
              'Вёл кросс-функциональную команду из 4 инженеров (frontend и backend): код-ревью, one-to-one, перфоманс-ревью и планы развития.',
              'Определил технический уровень найма и вёл собеседования frontend-кандидатов.',
              'Зафиксировал командные договорённости как общие Claude Code Skills и инструкции, чтобы код, написанный с помощью AI, соответствовал архитектуре и стандартам ревью.',
            ],
            en: [
              'Owned frontend architecture for the EdTech web platform while shipping production code daily as a hands-on lead.',
              'Led a cross-functional team of 4 engineers (frontend and backend): code review, 1:1s, performance reviews and growth plans.',
              'Defined the technical hiring bar and ran the interview loop for frontend candidates.',
              'Standardized team conventions as shared Claude Code Skills and instruction files, so AI-assisted code matched project architecture and review standards.',
            ],
          },
        },
        {
          title: { ru: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
          start: '2024-09',
          end: '2026-02',
          highlights: {
            ru: [
              'Возглавил перевод React-кодовой базы на 433 тыс. строк со смешанными подходами на строгий Feature-Sliced Design поверх Vite — выбрал распространённый стандарт, чтобы новые инженеры разбирались в проекте без долгого онбординга.',
              'Собрал на Node.js и OpenAI API инструмент локализации для 13 языков: перевод одной задачи сократился с 30 минут до 2.',
              'Выбрал Statsig вместо GrowthBook и внедрил как платформу экспериментов — это дало 100+ A/B-тестов на апсейл-сценариях, а дашборды Amplitude подтверждали корректность данных.',
              'Покрыл критичные для бизнеса сценарии E2E-тестами на Playwright, блокирующими релиз в CI: два релиза с поломанным апсейлом так и не доехали до прода.',
              'Перевёл мониторинг ошибок с Bugsnag на Sentry и ускорил обнаружение регрессий в ключевых функциях.',
            ],
            en: [
              'Led the migration of a 433K-line mixed-paradigm React codebase to strict Feature-Sliced Design on Vite, choosing a widely adopted standard so new engineers could navigate and extend it with minimal ramp-up.',
              'Built a Node.js + OpenAI API localization tool for 13 languages, cutting per-task translation time from 30 minutes to 2.',
              'Selected Statsig over GrowthBook and integrated it as the experimentation platform, enabling 100+ A/B tests on upsell flows, with Amplitude dashboards validating data integrity.',
              'Covered business-critical flows with Playwright E2E tests gating every release in CI — blocking 2 releases that would have broken the revenue-critical upsell flow.',
              'Migrated error monitoring from Bugsnag to Sentry, speeding up detection of regressions in core features.',
            ],
          },
        },
      ],
    },
    {
      id: 'kolesa',
      company: 'Kolesa Group',
      note: 'Krisha.kz',
      href: 'https://krisha.kz',
      location: { ru: 'Алматы, Казахстан', en: 'Almaty, Kazakhstan' },
      roles: [
        {
          title: { ru: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
          start: '2022-07',
          end: '2024-09',
          highlights: {
            ru: [
              'Со-руководил переводом основных модулей Krisha.kz (~1,5 млн MAU) с монолита на PHP/jQuery на Vue 3 / Nuxt 3 с SSR и написал эталонную реализацию, по которой шли остальные инженеры.',
              'Собрал общекорпоративную UI-библиотеку на Vue и Storybook по дизайн-системе из Figma — она до сих пор единый источник правды для Krisha.kz и Kolesa.kz.',
              'Сократил онбординг нового разработчика с двух дней до ~10 минут набором bash-скриптов вокруг Docker, Nginx и LDAP.',
              'В одиночку сделал webview для цифрового подписания договоров на недвижимость, встроенный в приложения iOS и Android; проект помог Kolesa стать первой продуктовой компанией Казахстана с аккредитованным удостоверяющим центром.',
              'Признан «Top Frontend 2023».',
            ],
            en: [
              'Co-led the migration of Krisha.kz core modules (~1.5M MAU) from a PHP/jQuery monolith to Vue 3 / Nuxt 3 SSR, building the reference implementation other engineers followed.',
              'Built the company-wide Vue + Storybook UI library from the Figma design system — still the single source of truth for Krisha.kz and Kolesa.kz.',
              'Cut new-developer onboarding from 2 days to ~10 minutes with a bash automation suite covering Docker, Nginx and LDAP.',
              'Sole developer on the digital real-estate contract-signing webview embedded in the iOS and Android apps — a project that helped Kolesa become the first product company in Kazakhstan to operate an accredited Certificate Authority.',
              'Recognized as “Top Frontend 2023”.',
            ],
          },
        },
        {
          title: { ru: 'Middle Frontend Developer', en: 'Middle Frontend Developer' },
          start: '2019-05',
          end: '2022-07',
          highlights: {
            ru: [
              'Построил CRM.krisha.kz — SPA на Vue.js для работы с лидами, инструментов агентов и обработки звонков.',
              'Реализовал автообзвон в реальном времени поверх WebSockets (Centrifugo): операторы колл-центра стали быстрее обрабатывать лиды и превращать неполные заявки в структурированные записи.',
              'Сделал интерфейсы «Новостройки», «Лидогенерация» и «Агенты Krisha», проверяя многошаговые сценарии через A/B-тесты.',
              'Перевёл сборку с Webpack 4 на 5, где уместно внедрил Vite и настроил CI/CD на GitHub Actions с dev-окружением в Docker.',
            ],
            en: [
              'Built CRM.krisha.kz as a Vue.js SPA for lead management, agent tooling and call handling.',
              'Implemented real-time autodialing over WebSockets (Centrifugo), helping call-center operators process leads faster and turn incomplete leads into structured records.',
              'Delivered the New Flats, Lead Generation and Krisha Agents interfaces, validating multi-step flows through A/B testing.',
              'Migrated builds from Webpack 4 to 5, introduced Vite where appropriate, and set up GitHub Actions CI/CD with Dockerized dev environments.',
            ],
          },
        },
      ],
    },
    {
      id: 'alexandrov',
      company: 'Alexandrov.co',
      location: { ru: 'Алматы, Казахстан', en: 'Almaty, Kazakhstan' },
      roles: [
        {
          title: { ru: 'Frontend Developer', en: 'Frontend Developer' },
          start: '2017-06',
          end: '2019-05',
          highlights: {
            ru: [
              'Erinfo: сделал работу с камерой и распознавание лиц на React Native поверх Amazon Rekognition — в экстренной ситуации приложение опознавало пациента и отдавало его медицинские данные службам первой помощи.',
              'Restaff: запустил кроссплатформенное десктопное приложение для учёта рабочего времени на Electron под Windows и macOS.',
              'Вёл коммерческие проекты на Vue, React и React Native для международных заказчиков с Upwork, работая асинхронно в разных часовых поясах.',
              'Внедрил Storybook для разработки компонентов и ускорил передачу макетов из дизайна в код.',
            ],
            en: [
              'Erinfo: built the camera flow and face recognition in React Native on top of Amazon Rekognition — in an emergency the app identified a patient and returned their medical data to first responders.',
              'Restaff: shipped a cross-platform Electron desktop app for time tracking on Windows and macOS.',
              'Delivered commercial projects in Vue, React and React Native for international Upwork clients, working asynchronously across time zones.',
              'Set up Storybook for component development, speeding up the design-to-development handoff.',
            ],
          },
        },
      ],
    },
  ],

  earlyCareer: [
    {
      id: 'kazpost',
      company: { ru: 'Казпочта', en: 'Kazpost' },
      role: { ru: 'Ведущий специалист Service Desk', en: 'Lead Service Desk Specialist' },
      start: '2016-10',
      end: '2017-06',
      summary: {
        ru: 'Поддержка пользователей, обработка обращений, доступы к внутренним системам банка и почты.',
        en: 'User support, ticket triage and access management for the internal banking and postal systems.',
      },
    },
    {
      id: 'kizmet',
      company: { ru: 'ТОО «Кызмет Саяхат»', en: 'Kizmet Sayahat' },
      role: { ru: 'Системный администратор', en: 'System Administrator' },
      start: '2015-09',
      end: '2016-06',
      summary: {
        ru: 'Локальная сеть и парк техники, сайт компании, видеонаблюдение и IP-телефония в туристической фирме.',
        en: 'The local network and hardware fleet, the company website, CCTV and IP telephony at a travel agency.',
      },
    },
  ],

  projects: [
    {
      id: 'splitcheck',
      title: 'SplitCheck Bot',
      period: '2026',
      summary: {
        ru: 'Телеграм-бот, который читает фото чека и делит счёт на компанию.',
        en: 'A Telegram bot that reads a photo of a receipt and splits the bill across the group.',
      },
      description: {
        ru: 'Распознаёт позиции чека через Claude Vision и делит счёт: поровну или «каждый своё», с общими позициями и пропорциональным сервисным сбором. Отмечает, кто уже заплатил, а команда /debtors напоминает должникам по всем чекам чата.',
        en: 'Recognizes line items with Claude Vision and splits the bill either evenly or item-by-item, with shared items and a proportional service charge. Tracks who has already paid, and /debtors nudges everyone still owing across every receipt in the chat.',
      },
      impact: {
        ru: 'Личный проект: от идеи до авто-деплоя на Fly.io через GitHub Actions.',
        en: 'A personal project taken from idea to automated Fly.io deploys via GitHub Actions.',
      },
      tags: ['TypeScript', 'Node 24', 'grammY', 'Claude Vision', 'SQLite', 'Drizzle ORM', 'Docker', 'Fly.io'],
      links: [
        { label: { ru: 'Открыть код', en: 'View source' }, href: 'https://github.com/BekStar7/split-bill-bot', primary: true },
        { label: { ru: 'Бот в Telegram', en: 'Bot on Telegram' }, href: 'https://t.me/billspliter_bot' },
      ],
    },
    {
      id: 'krisha-ssr',
      title: {
        ru: 'Krisha.kz на Vue 3 / Nuxt 3 SSR',
        en: 'Krisha.kz on Vue 3 / Nuxt 3 SSR',
      },
      period: '2022 — 2024',
      summary: {
        ru: 'Перевод ядра маркетплейса недвижимости с PHP/jQuery на современный SSR-стек.',
        en: 'Moving the core of a real-estate marketplace from PHP/jQuery to a modern SSR stack.',
      },
      description: {
        ru: 'Со-руководил миграцией основных модулей Krisha.kz — крупнейшего маркетплейса недвижимости Казахстана — с монолита на Vue 3 / Nuxt 3 с серверным рендерингом. Написал эталонную реализацию, по которой переносили остальные разделы.',
        en: 'Co-led the migration of the core modules of Krisha.kz — Kazakhstan’s largest real-estate marketplace — from a monolith to Vue 3 / Nuxt 3 with server-side rendering, and wrote the reference implementation the rest of the sections followed.',
      },
      impact: {
        ru: '~1,5 млн активных пользователей в месяц.',
        en: '~1.5M monthly active users.',
      },
      tags: ['Vue 3', 'Nuxt 3', 'SSR', 'TypeScript'],
      links: [
        { label: { ru: 'Открыть Krisha.kz', en: 'Visit Krisha.kz' }, href: 'https://krisha.kz', primary: true },
      ],
    },
    {
      id: 'design-system',
      title: {
        ru: 'UI-библиотека Kolesa Group',
        en: 'Kolesa Group UI library',
      },
      period: '2022 — 2024',
      summary: {
        ru: 'Дизайн-система на Vue и Storybook — одна на два продукта компании.',
        en: 'A Vue + Storybook design system shared by two of the company’s products.',
      },
      description: {
        ru: 'Собрал общекорпоративную библиотеку компонентов по дизайн-системе из Figma и довёл её до состояния, в котором обе команды берут компоненты оттуда, а не пишут свои.',
        en: 'Built the company-wide component library from the Figma design system and took it to the point where both product teams pull components from it instead of writing their own.',
      },
      impact: {
        ru: 'До сих пор единый источник правды для Krisha.kz и Kolesa.kz.',
        en: 'Still the single source of truth for Krisha.kz and Kolesa.kz.',
      },
      tags: ['Vue', 'Storybook', 'Design Systems', 'Figma'],
      links: [],
    },
    {
      id: 'fsd-migration',
      title: {
        ru: 'Миграция 433K строк на Feature-Sliced Design',
        en: 'Migrating 433K lines to Feature-Sliced Design',
      },
      period: '2024 — 2026',
      summary: {
        ru: 'Приведение большой React-кодовой базы к одной понятной архитектуре.',
        en: 'Bringing a large React codebase under one comprehensible architecture.',
      },
      description: {
        ru: 'Кодовая база на 433 тыс. строк со смешанными подходами перешла на строгий Feature-Sliced Design поверх Vite. Выбрал распространённый стандарт осознанно: по нему есть документация и опыт на рынке, поэтому новый инженер ориентируется в проекте почти сразу.',
        en: 'A 433K-line mixed-paradigm codebase moved to strict Feature-Sliced Design on Vite. The standard was chosen deliberately: it is documented and widely known, so a new engineer can navigate the project almost immediately.',
      },
      impact: {
        ru: 'Онбординг новых инженеров перестал зависеть от того, кто им объясняет проект.',
        en: 'Onboarding no longer depends on who happens to explain the project.',
      },
      tags: ['React', 'TypeScript', 'Feature-Sliced Design', 'Vite'],
      links: [],
    },
    {
      id: 'l10n-tool',
      title: {
        ru: 'Инструмент локализации на 13 языков',
        en: 'A localization tool for 13 languages',
      },
      period: '2025',
      summary: {
        ru: 'Node.js + OpenAI API вместо ручного перевода интерфейсных строк.',
        en: 'Node.js + OpenAI API instead of translating interface strings by hand.',
      },
      description: {
        ru: 'Внутренний CLI, который переводит строки интерфейса сразу на 13 языков и кладёт их в нужные файлы проекта, сохраняя структуру ключей.',
        en: 'An internal CLI that translates interface strings into 13 languages at once and writes them back into the project’s locale files, preserving the key structure.',
      },
      impact: {
        ru: 'Перевод одной задачи: 30 минут → 2 минуты.',
        en: 'Per-task translation time: 30 minutes → 2 minutes.',
      },
      tags: ['Node.js', 'OpenAI API', 'i18n', 'CLI'],
      links: [],
    },
    {
      id: 'e-signing',
      title: {
        ru: 'Цифровое подписание договоров на недвижимость',
        en: 'Digital real-estate contract signing',
      },
      period: '2023',
      summary: {
        ru: 'Webview для подписания договоров, встроенный в приложения iOS и Android.',
        en: 'A contract-signing webview embedded in the iOS and Android apps.',
      },
      description: {
        ru: 'Единственный разработчик на проекте: интерфейс подписания сделок с недвижимостью внутри мобильных приложений, с требованиями к юридической значимости подписи.',
        en: 'Sole developer on the project: a real-estate deal-signing interface inside the mobile apps, built against the requirements for a legally meaningful signature.',
      },
      impact: {
        ru: 'Помог Kolesa стать первой продуктовой компанией Казахстана с аккредитованным удостоверяющим центром.',
        en: 'Helped Kolesa become the first product company in Kazakhstan to operate an accredited Certificate Authority.',
      },
      tags: ['Vue', 'WebView', 'iOS', 'Android'],
      links: [],
    },
  ],

  education: [
    {
      id: 'aupet-master',
      institution: {
        ru: 'Алматинский университет энергетики и связи',
        en: 'Almaty University of Power Engineering and Telecommunications',
      },
      degree: { ru: 'Магистратура', en: 'Master’s degree' },
      field: { ru: 'Информационные системы', en: 'Information Systems' },
      start: '2015',
      end: '2017',
    },
    {
      id: 'aupet-bachelor',
      institution: {
        ru: 'Алматинский университет энергетики и связи',
        en: 'Almaty University of Power Engineering and Telecommunications',
      },
      degree: { ru: 'Бакалавриат', en: 'Bachelor’s degree' },
      field: { ru: 'Информационные системы', en: 'Information Systems' },
      start: '2011',
      end: '2015',
    },
    {
      id: 'mpei-bachelor',
      institution: {
        ru: 'Московский энергетический институт (НИУ «МЭИ»)',
        en: 'Moscow Power Engineering Institute (NRU MPEI)',
      },
      degree: { ru: 'Бакалавриат', en: 'Bachelor’s degree' },
      field: {
        ru: 'Экономика и менеджмент в энергетике и промышленности',
        en: 'Economics and Management in Energy and Industry',
      },
      start: '2011',
      end: '2015',
    },
  ],

  languages: [
    {
      id: 'ru',
      name: { ru: 'Русский', en: 'Russian' },
      level: { ru: 'Родной', en: 'Native' },
      proficiency: 5,
    },
    {
      id: 'kk',
      name: { ru: 'Казахский', en: 'Kazakh' },
      level: { ru: 'Родной', en: 'Native' },
      proficiency: 5,
    },
    {
      id: 'en',
      name: { ru: 'Английский', en: 'English' },
      level: { ru: 'Профессиональный рабочий', en: 'Professional working' },
      proficiency: 4,
    },
  ],

  press: [
    {
      id: 'weproject-2022',
      title: {
        ru: 'Как сменить профессию и стать разработчиком: опыт сотрудников Kolesa Group',
        en: 'Changing careers to become a developer: stories from Kolesa Group engineers',
      },
      outlet: 'weproject.media',
      date: '2022-11-02',
      href: 'https://weproject.media/articles/detail/kak-smenit-professiyu-i-stat-razrabotchikom-opyt-sotrudnikov-kolesa-group/',
      quote: {
        ru: 'Во время прохождения курсов на новой должности я понял, что работа над визуальной составляющей сайта мне интересна.',
        en: 'While taking a course in my new role, I realized that working on the visual side of a website was what interested me.',
      },
    },
  ],
}
