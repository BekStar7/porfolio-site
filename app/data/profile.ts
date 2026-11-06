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
    ru: 'Делаю высоконагруженные веб-продукты на Vue 3 / Nuxt и React / TypeScript и строю архитектуру, которая выдерживает рост команды.',
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
      value: '810',
      label: { ru: 'legacy-файлов в одиночку заменил на FSD', en: 'legacy files replaced with FSD, solo' },
    },
  ],

  about: {
    ru: [
      'Senior Frontend Engineer с 9 годами опыта: React и Vue 3 / Nuxt 3 на TypeScript. На последнем месте руководил командой из 4 инженеров, работавшей над Finelo в Zimran (~500 тыс. MAU, 13 языков, ЕС и США), и сам писал продакшн-код.',
      'В одиночку перевёл React-кодовую базу на Feature-Sliced Design, совместно руководил миграцией Krisha.kz (~1,5 млн MAU) на Nuxt 3 SSR, создал общую для компании UI-библиотеку на Vue, запустил 100+ A/B-тестов, внедрил управление согласиями под GDPR/CCPA и E2E-тесты в CI. Top Frontend 2023 в Kolesa Group.',
      'В разработку пришёл не сразу. Начинал эникейщиком в турфирме, потом работал в Service Desk «Казпочты» и собирался в системные администраторы. На курсах понял, что визуальная часть веба интересует меня больше, и перешёл во frontend.',
      'Ищу удалённую работу над продуктом, который действительно нужен людям, в команде, где есть у кого учиться.',
    ],
    en: [
      'Senior Frontend Engineer with 9 years of experience, working across React and Vue 3 / Nuxt 3 with TypeScript. Most recently a hands-on lead of 4 engineers on Finelo at Zimran (~500K MAU, 13 languages, EU and US).',
      'Migrated a React codebase to Feature-Sliced Design solo, co-led a Nuxt 3 SSR migration at Krisha.kz (~1.5M MAU), built a company-wide Vue UI library, and shipped 100+ A/B tests, GDPR/CCPA consent management and CI-gated E2E testing. Top Frontend 2023 at Kolesa Group.',
      'I did not start out in engineering. I was the IT generalist at a travel agency, then worked Service Desk at Kazpost, heading for a sysadmin career. A course along the way showed me I cared far more about the visual side of the web, so I moved into frontend.',
      'Looking for remote work on a product people genuinely need, on a team with someone to learn from.',
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
      items: ['React', 'Next.js', 'Vue 3', 'Nuxt 3', 'Preact', 'TypeScript', 'JavaScript', 'HTML/CSS', 'SCSS', 'Tailwind CSS', 'Three.js'],
    },
    {
      id: 'state',
      title: { ru: 'Управление состоянием', en: 'State management' },
      items: ['Redux Toolkit', 'MobX', 'Recoil', 'Pinia', 'Vuex'],
    },
    {
      id: 'architecture',
      title: { ru: 'Архитектура', en: 'Architecture' },
      items: ['Feature-Sliced Design', 'SSR / SSG', 'Web Performance', 'Design Systems', 'Component Libraries', 'Storybook'],
    },
    {
      id: 'quality',
      title: { ru: 'Тестирование и качество', en: 'Testing & quality' },
      items: ['Playwright', 'Vitest', 'Jest', 'E2E Testing', 'ESLint', 'Biome', 'Sentry', 'CI/CD', 'Canary Releases'],
    },
    {
      id: 'tooling',
      title: { ru: 'Инструменты и инфраструктура', en: 'Tooling & infrastructure' },
      items: ['Vite', 'Webpack', 'pnpm', 'Node.js', 'Docker', 'Nginx', 'OpenResty', 'GitHub Actions', 'Vercel', 'AWS Route 53'],
    },
    {
      id: 'product',
      title: { ru: 'Продукт и данные', en: 'Product & data' },
      items: ['A/B Testing (Statsig)', 'Amplitude', 'i18n', 'REST', 'WebSockets'],
    },
    {
      id: 'compliance',
      title: { ru: 'Комплаенс', en: 'Compliance' },
      items: ['GDPR', 'CCPA', 'Consent Management (TrustArc)'],
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
      logo: '/logos/zimran.svg',
      location: { ru: 'Удалённо (офис в Лимасоле)', en: 'Remote (Limassol HQ)' },
      roles: [
        {
          title: { ru: 'Web Team Lead', en: 'Web Team Lead' },
          start: '2026-02',
          end: '2026-08',
          highlights: {
            ru: [
              'Отвечал за frontend-архитектуру Finelo, EdTech-платформы Zimran с ~500 тыс. MAU и 20+ тыс. DAU, и оставался главным контрибьютором по коду: 309 из 526 смёрженных PR с сентября 2024 по август 2026.',
              'Руководил командой из 4 frontend- и backend-инженеров, которая выпускала 2–4 фичи в неделю; проводил код-ревью, 1:1 и performance review, составлял индивидуальные планы развития.',
              'Определил планку найма во frontend и за время обеих ролей в Zimran провёл 80+ intro-звонков и 63 технических собеседования, нанял 3 инженеров. Ещё двоих привёл по рекомендации и менторил: они пришли на middle и выросли до senior.',
              'Ввёл canary-релизы для изменений в upsell-воронке, ключевой для выручки: 10% пользователей, затем 50%, затем все, с 15-минутной паузой на наблюдение между шагами.',
              'Сократил First Contentful Paint на мобильных на 60% в лабораторных замерах Lighthouse (4,9 → 2,0 с, без сторонних скриптов): вынес критический CSS в HTML и добавил статический лоадер.',
              'Закрепил командные договорённости в общих агентах, slash-командах и memory-файлах для Claude Code и в spec-driven процессе на OpenSpec, чтобы AI писал код по архитектуре проекта.',
            ],
            en: [
              'Owned frontend architecture for Finelo, Zimran’s EdTech web platform with ~500K MAU and 20K+ DAU, and remained its top code contributor (309 of 526 merged PRs from Sep 2024 to Aug 2026).',
              'Led a team of 4 frontend and backend engineers that shipped 2–4 features a week; ran code reviews, 1:1s and performance reviews, and wrote individual development plans.',
              'Defined the frontend hiring bar and, across both Zimran roles, ran 80+ intro calls and 63 technical interviews, hiring 3 engineers; also referred and coached 2 engineers who joined at mid-level and grew to senior.',
              'Introduced canary releases for changes touching the revenue-critical upsell flow: 10% of users, then 50%, then 100%, with 15-minute bake periods between steps.',
              'Cut mobile First Contentful Paint by 60% in Lighthouse lab runs (4.9 → 2.0 s, third-party scripts excluded) by inlining critical CSS and adding a static loader.',
              'Codified team conventions into shared Claude Code agents, commands and memory files plus a spec-driven OpenSpec workflow, so AI-assisted code followed the project architecture.',
            ],
          },
        },
        {
          title: { ru: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
          start: '2024-09',
          end: '2026-02',
          highlights: {
            ru: [
              'В одиночку за 13 месяцев перевёл React-кодовую базу на строгий Feature-Sliced Design: заменил 810 из 811 legacy-файлов, а код за это время вырос с 48 до 125 тыс. строк TypeScript.',
              'Заменил GrowthBook на Statsig как платформу экспериментов, что позволило запустить 100+ A/B-тестов в upsell-воронках; выигравшие варианты поднимали ARPU на $2–5 и повышали конверсию в upsell.',
              'Обновил стек (React 17 → 19, Vite 5 → 7, Tailwind 3 → 4, Jest → Vitest, npm → pnpm, Bugsnag → Sentry) и убрал MUI и styled-components; время продакшн-сборки сократилось на 20%, хотя кода стало в 2,6 раза больше.',
              'Вместе с юристами вёл внедрение GDPR и CCPA для ЕС и США: выбрал TrustArc из 5 рассмотренных платформ управления согласиями для веба и мобильного приложения и настроил запуск 7 SDK аналитики и мониторинга только после согласия пользователя.',
              'Внедрил E2E-тесты на Playwright (55 тестов для мобильных и десктопа) и пайплайн GitHub Actions → Vercel, который ставил релизный тег только при зелёных тестах. Он остановил 2 релиза, ломавших upsell.',
              'Разработал инструмент локализации на Node.js и OpenAI API для 13 языков, который сократил время перевода одной задачи с 30 до 2 минут.',
              'Ввёл согласованные с командой правила ESLint, затем заменил Prettier на Biome и оставил ESLint только для границ импортов FSD и i18n. Полный прогон lint и форматирования ускорился с 26,9 до 9,9 с.',
            ],
            en: [
              'Single-handedly migrated the React codebase to strict Feature-Sliced Design over 13 months, replacing 810 of 811 legacy files as the codebase grew from 48K to 125K lines of TypeScript.',
              'Replaced GrowthBook with Statsig as the experimentation platform, enabling 100+ A/B tests on upsell flows; winning variants lifted ARPU by $2–5 and improved upsell conversion.',
              'Modernized the stack (React 17 → 19, Vite 5 → 7, Tailwind 3 → 4, Jest → Vitest, npm → pnpm, Bugsnag → Sentry) and removed MUI and styled-components, cutting production build time by 20% despite 2.6× more code.',
              'Drove GDPR/CCPA compliance across the EU and US with the legal team: chose TrustArc out of 5 evaluated consent platforms for web and mobile, and gated 7 analytics and monitoring SDKs on user consent.',
              'Introduced Playwright E2E tests (55 tests, mobile and desktop) and a GitHub Actions → Vercel pipeline that tagged a release only when the tests passed, blocking 2 releases that would have broken the upsell flow.',
              'Built a Node.js + OpenAI API tool that localized the product into 13 languages and cut per-task translation time from 30 to 2 minutes.',
              'Added ESLint rules the team agreed on, then replaced Prettier with Biome and scoped ESLint to FSD import boundaries and i18n checks, cutting the full lint and format check from 26.9 to 9.9 seconds.',
            ],
          },
        },
      ],
    },
    {
      id: 'kolesa',
      company: 'Kolesa Group',
      note: 'Krisha.kz',
      noteHref: 'https://krisha.kz',
      href: 'https://kolesa.group',
      logo: '/logos/kolesa.svg',
      location: { ru: 'Алматы, Казахстан', en: 'Almaty, Kazakhstan' },
      roles: [
        {
          title: { ru: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
          start: '2022-07',
          end: '2024-09',
          highlights: {
            ru: [
              'Совместно руководил миграцией ключевых модулей Krisha.kz (~1,5 млн MAU) с PHP/Twig/jQuery-монолита на Vue 3 / Nuxt 3 SSR и сделал эталонную реализацию, на которую ориентировались остальные инженеры. Новички больше не тратили месяцы на изучение устаревшего Twig.',
              'Признан «Top Frontend 2023» в Kolesa Group.',
              'Создал общую для компании UI-библиотеку на Vue и Storybook на основе дизайн-системы в Figma. Она до сих пор служит единым источником правды для Krisha.kz и Kolesa.kz.',
              'Сократил настройку локального окружения для новых разработчиков с 2 дней до ~10 минут с помощью набора bash-скриптов (Docker, Nginx, LDAP).',
              'В одиночку сделал webview для цифрового подписания договоров на недвижимость в iOS- и Android-приложениях. Это была часть проекта, с которым Kolesa стала первой продуктовой компанией в Казахстане с собственным аккредитованным удостоверяющим центром.',
              'На этапе product discovery для «Krisha Агенты», инструментов для риелторов, предложил более дешёвый подход к отчётам: выпустили за 2 недели вместо оценённых 4–6. Вместе с продактами и дизайнерами приоритизировал фичи по RICE.',
              'Сделал интерактивную игру для гостей Kolesa Conf 2023 и проводил её на стенде компании.',
            ],
            en: [
              'Co-led migration of Krisha.kz core modules (~1.5M MAU) from a PHP/Twig/jQuery monolith to Vue 3 / Nuxt 3 SSR and built the reference implementation other engineers followed, so new hires no longer spent months learning a legacy Twig stack.',
              'Named Top Frontend 2023 at Kolesa Group.',
              'Created the company-wide Vue + Storybook UI library from the Figma design system, still the single source of truth for Krisha.kz and Kolesa.kz.',
              'Cut local dev-environment setup for new developers from 2 days to ~10 minutes with a bash automation suite covering Docker, Nginx and LDAP.',
              'Built the digital real-estate contract-signing webview in the iOS and Android apps as the sole developer, part of the project that made Kolesa the first product company in Kazakhstan to operate an accredited certificate authority.',
              'In product discovery for Krisha Agents, a toolset for realtors, proposed a cheaper reporting approach that shipped in 2 weeks instead of an estimated 4–6; prioritized features with product and design via RICE.',
              'Built an interactive game for Kolesa Conf 2023 attendees and ran it at the company booth.',
            ],
          },
        },
        {
          title: { ru: 'Middle Frontend Developer', en: 'Middle Frontend Developer' },
          start: '2019-05',
          end: '2022-07',
          highlights: {
            ru: [
              'Реализовал автообзвон в реальном времени через WebSockets (Centrifugo) для 4–6 операторов колл-центра, которые обрабатывали 100+ лидов в день. Они стали быстрее разбирать лиды и превращать неполные заявки в структурированные записи.',
              'Разработал CRM.krisha.kz, SPA на Vue.js для работы с лидами, агентами и звонками.',
              'Сделал интерфейсы разделов «Новостройки», «Лидогенерация» и «Krisha Агенты» и проверил их многошаговые сценарии через A/B-тесты.',
              'Перевёл сборку с Webpack 4 на 5, внедрил Vite в подходящих проектах, настроил CI/CD на GitHub Actions и dev-окружение в Docker.',
            ],
            en: [
              'Implemented real-time autodialing over WebSockets (Centrifugo) for 4–6 call-center operators handling 100+ leads a day, so they worked through leads faster and turned incomplete ones into structured records.',
              'Developed CRM.krisha.kz as a Vue.js SPA for lead management, agent tooling and call handling.',
              'Built interfaces for new-build listings, lead generation and Krisha Agents, validating multi-step flows via A/B tests.',
              'Migrated builds from Webpack 4 to 5, introduced Vite where appropriate, and set up GitHub Actions CI/CD with Dockerized dev environments.',
            ],
          },
        },
      ],
    },
    {
      id: 'alexandrov',
      company: 'Alexandrov.co',
      logo: '/logos/alexandrov.svg',
      location: { ru: 'Алматы, Казахстан', en: 'Almaty, Kazakhstan' },
      roles: [
        {
          title: { ru: 'Frontend Developer', en: 'Frontend Developer' },
          start: '2017-06',
          end: '2019-05',
          highlights: {
            ru: [
              'Реализовал работу с камерой и сценарий распознавания лиц для Erinfo (React Native) на бэкенде Amazon Rekognition, который идентифицировал пациента и отдавал его медицинские данные службам первой помощи в экстренных ситуациях.',
              'Запустил Restaff, Electron-приложение для учёта рабочего времени под Windows и macOS в духе Hubstaff.',
              'Удалённо выполнил 10+ проектов для международных клиентов с Upwork на Vue, React, React Native и Electron: карту биткоин-банкоматов, IoT-дашборд для ветрогенераторов, парсер магазинов кроссовок и другие.',
              'Сделал 3 редизайна anime.club подряд и настроил там Storybook, чтобы ускорить передачу макетов из дизайна в разработку.',
            ],
            en: [
              'Built the camera and face-recognition flow for Erinfo (React Native) on an Amazon Rekognition backend that identified patients and returned their medical data to first responders in emergencies.',
              'Shipped Restaff, a Hubstaff-style Electron desktop time-tracking app for Windows and macOS.',
              'Delivered 10+ projects asynchronously for international Upwork clients in Vue, React, React Native and Electron, including a Bitcoin ATM map, a wind-turbine IoT dashboard and a sneaker-store scraper.',
              'Implemented 3 successive redesigns of anime.club and set up Storybook there to speed up the handoff from design to development.',
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
      id: 'paper-borders',
      title: 'Paper Borders',
      period: '2026',
      summary: {
        ru: 'Браузерная пошаговая геополитическая стратегия на реальной карте мира.',
        en: 'A browser-based, turn-based geopolitical strategy game on a real-world map.',
      },
      description: {
        ru: 'Сайд-проект, который делаю вместе с партнёром: игрок управляет одной из 50 стран (война, дипломатия, внутренние реформы), а диалоги в игре работают на AI. Сделал интерактивную карту мира на Three.js и Preact, оптимизировал её под десктопные и мобильные браузеры и реализовал основной геймплей.',
        en: 'A side project I am building with a partner: players lead one of 50 countries through war, diplomacy and internal reform, with AI-powered in-game conversations. I built the interactive world map in Three.js and Preact, optimized it for desktop and mobile browsers, and implemented core gameplay.',
      },
      impact: {
        ru: 'В октябре 2026 запустили закрытую бету.',
        en: 'Closed beta launched in October 2026.',
      },
      tags: ['Three.js', 'Preact', 'TypeScript'],
      links: [
        { label: { ru: 'Открыть сайт', en: 'Visit the site' }, href: 'https://paperborders.world/?utm_source=bekstar.tech&utm_medium=portfolio&utm_campaign=projects', primary: true },
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
        ru: 'Со-руководил миграцией основных модулей Krisha.kz, крупнейшего маркетплейса недвижимости Казахстана, с монолита на Vue 3 / Nuxt 3 с серверным рендерингом. Написал эталонную реализацию, по которой переносили остальные разделы.',
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
        ru: 'Дизайн-система на Vue и Storybook, одна на два продукта компании.',
        en: 'A Vue + Storybook design system shared by two of the company’s products.',
      },
      description: {
        ru: 'Собрал общую для компании библиотеку компонентов по дизайн-системе из Figma. Обе команды берут компоненты из неё и не пишут свои.',
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
        ru: 'Миграция на Feature-Sliced Design',
        en: 'Migrating to Feature-Sliced Design',
      },
      period: '2024 — 2026',
      summary: {
        ru: 'Приведение большой React-кодовой базы к одной понятной архитектуре.',
        en: 'Bringing a large React codebase under one comprehensible architecture.',
      },
      description: {
        ru: 'За 13 месяцев заменил 810 из 811 legacy-файлов React-кодовой базы и перевёл её на строгий Feature-Sliced Design, пока код вырос с 48 до 125 тыс. строк TypeScript. Стандарт выбрал осознанно: у него есть документация и опыт на рынке, поэтому новый инженер ориентируется в проекте почти сразу.',
        en: 'Over 13 months I replaced 810 of 811 legacy files and moved the React codebase to strict Feature-Sliced Design while it grew from 48K to 125K lines of TypeScript. The standard was chosen deliberately: it is documented and widely known, so a new engineer can navigate the project almost immediately.',
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
        ru: 'Единственный разработчик проекта: интерфейс подписания сделок с недвижимостью внутри мобильных приложений, с учётом требований к юридической значимости подписи.',
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
      field: { ru: 'Информационные технологии', en: 'Information Technology' },
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
      field: { ru: 'Информационные технологии', en: 'Information Technology' },
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
      level: { ru: 'B2, рабочий', en: 'B2, professional working' },
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
