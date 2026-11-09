<script setup lang="ts">
import { profile } from '~/data/profile'
import type { MaybeLocalized } from '~~/shared/types/profile'

const { t } = useI18n()
const { tx, code } = useLocalized()
const localePath = useLocalePath()
const siteConfig = useSiteConfig()

// Подсветка текущего раздела в шапке. Наблюдатель живёт вместе со страницей:
// при смене языка разделы монтируются заново, и он подписывается уже на них.
useActiveSectionObserver()

const origin = computed(() => siteConfig.url.replace(/\/$/, ''))
const canonical = computed(() => `${origin.value}${localePath('index')}`)
const ogImage = computed(() => `${origin.value}/og-${code.value}.png`)
const language = computed(() => (code.value === 'en' ? 'en-US' : 'ru-RU'))

useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),

  ogType: 'profile',
  profileFirstName: () => tx(profile.name).split(' ')[0],
  profileLastName: () => tx(profile.name).split(' ').slice(1).join(' '),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogUrl: () => canonical.value,
  ogSiteName: () => tx(profile.name),
  ogImage: () => ogImage.value,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: () => t('meta.ogImageAlt'),

  twitterCard: 'summary_large_image',
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
  twitterImage: () => ogImage.value,
  twitterImageAlt: () => t('meta.ogImageAlt'),

  author: () => tx(profile.name),
})

const currentEmployers = computed(() =>
  profile.experience
    .filter(job => job.roles.some(role => role.end === null))
    .map(job => ({
      '@type': 'Organization',
      name: en(job.company),
      ...(job.href ? { url: job.href } : {}),
    })),
)

const en = <T,>(value: MaybeLocalized<T>) => inLocale(value, 'en')

/**
 * Структурированные данные Schema.org.
 * Person + ProfilePage — та разметка, по которой поисковики строят карточку
 * человека; sameAs связывает сайт с GitHub и LinkedIn.
 *
 * WebSite и Person — одни и те же сущности на обеих страницах (общий @id),
 * поэтому описаны одинаково, по-английски; русское имя — в alternateName.
 * На языке страницы только ProfilePage: он описывает конкретную страницу,
 * и его язык указан в inLanguage.
 */
const jsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${origin.value}/#website`,
      url: `${origin.value}/`,
      name: en(profile.name),
      alternateName: profile.name.ru,
      inLanguage: ['en-US', 'ru-RU'],
      publisher: { '@id': `${origin.value}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${canonical.value}#page`,
      url: canonical.value,
      name: t('meta.title'),
      description: t('meta.description'),
      inLanguage: language.value,
      isPartOf: { '@id': `${origin.value}/#website` },
      // Google требует mainEntity у ProfilePage: это человек, которому посвящена страница
      mainEntity: { '@id': `${origin.value}/#person` },
      primaryImageOfPage: ogImage.value,
    },
    {
      '@type': 'Person',
      '@id': `${origin.value}/#person`,
      name: en(profile.name),
      alternateName: profile.name.ru,
      url: `${origin.value}/`,
      image: `${origin.value}/og-en.png`,
      jobTitle: en(profile.role),
      description: en(profile.about)[0],
      email: `mailto:${profile.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: en(profile.location).split(',')[0]?.trim(),
        addressCountry: 'KZ',
      },
      sameAs: profile.socials
        .filter(social => social.href.startsWith('http'))
        .map(social => social.href),
      knowsAbout: profile.skills.flatMap(group => group.items),
      knowsLanguage: profile.languages.map(item => ({
        '@type': 'Language',
        name: item.name.en,
      })),
      alumniOf: [...new Set(profile.education.map(entry => en(entry.institution)))]
        .map(name => ({ '@type': 'CollegeOrUniversity', name })),
      hasOccupation: {
        '@type': 'Occupation',
        name: en(profile.role),
        occupationLocation: {
          '@type': 'City',
          name: en(profile.location).split(',')[0]?.trim(),
        },
        skills: profile.skills.flatMap(group => group.items).join(', '),
      },
      // worksFor описывает текущее место работы, поэтому попадают только
      // компании с незакрытой должностью. Прошлые места — в тексте страницы.
      ...(currentEmployers.value.length ? { worksFor: currentEmployers.value } : {}),
    },
  ],
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(jsonLd.value),
    },
  ],
}))
</script>

<template>
  <div id="top">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <ProjectsSection />
    <SkillsSection />
    <EducationSection />
    <ContactSection />
  </div>
</template>
