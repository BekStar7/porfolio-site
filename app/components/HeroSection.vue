<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()

/**
 * Профили, которые рекрутер забирает первым делом. Почту здесь не повторяем:
 * к ней ведёт основная кнопка, а в контактах есть и mailto, и копирование.
 */
const profileLinks = profile.socials.filter(social => social.href.startsWith('http'))
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container">
      <p class="hero__status">
        <span class="hero__dot" aria-hidden="true" />
        {{ tx(profile.availability) }}
      </p>

      <h1 id="hero-title" class="hero__title">
        <span class="hero__name">{{ tx(profile.name) }}</span>
        <span class="hero__role">{{ tx(profile.role) }}</span>
      </h1>

      <p class="hero__tagline">{{ tx(profile.tagline) }}</p>

      <p class="hero__location">
        <AppIcon name="pin" :size="17" />
        {{ tx(profile.location) }}
      </p>

      <div class="hero__actions">
        <a class="btn btn--primary" href="#contact">
          {{ t('hero.ctaContact') }}
          <AppIcon name="arrowRight" :size="18" />
        </a>
        <a class="btn btn--ghost" href="#projects">{{ t('hero.ctaProjects') }}</a>

        <ul class="hero__profiles" :aria-label="t('a11y.profiles')">
          <li v-for="social in profileLinks" :key="social.id">
            <AppLink class="hero__profile" :href="social.href">
              <AppIcon :name="social.icon as never" :size="18" />
              {{ social.label }}
            </AppLink>
          </li>
        </ul>
      </div>

      <ul class="stats" :aria-label="t('hero.statsLabel')">
        <li v-for="stat in profile.stats" :key="stat.id" class="stats__item">
          <span class="stats__value">{{ tx(stat.value) }}</span>
          <span class="stats__label">{{ tx(stat.label) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  /* Нижний отступ даёт следующая секция — иначе просвет удваивается */
  padding-block: clamp(3.5rem, 2rem + 8vw, 7rem) 0;
  overflow: clip;
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.35rem 0.9rem 0.35rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--text-muted);
  font-size: var(--step--1);
}

.hero__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-veil);
}

.hero__title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-block-start: var(--space-xl);
}

.hero__name {
  font-size: var(--step-5);
}

.hero__role {
  font-size: var(--step-2);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--accent);
}

.hero__tagline {
  max-width: 44ch;
  margin-block-start: var(--space-l);
  color: var(--text-muted);
  font-size: var(--step-1);
  line-height: 1.55;
}

.hero__location {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-block-start: var(--space-m);
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-s);
  margin-block-start: var(--space-xl);
}

/* Профили — вторичное действие: текстовые ссылки рядом с кнопками, без рамок */
.hero__profiles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs) var(--space-m);
  margin: 0;
  padding: 0 var(--space-xs);
  list-style: none;
}

.hero__profile {
  /* Цель нажатия 44 px в высоту, хотя видна только подпись */
  min-height: 2.75rem;
  color: var(--text-muted);
  font-size: var(--step-0);
  font-weight: 600;
  text-decoration: none;
}

.hero__profile:hover {
  color: var(--accent);
}

.stats {
  display: grid;
  /* Четыре цифры: 2×2 на телефоне вместо столбика, в ряд с планшета */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin-block-start: var(--space-2xl);
  padding: 0;
  list-style: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  background: var(--border);
  overflow: hidden;
}

.stats__item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--space-m) var(--space-s);
  background: var(--surface);
}

@media (min-width: 48rem) {
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .stats__item {
    padding: var(--space-l) var(--space-m);
  }
}

.stats__value {
  font-size: var(--step-3);
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.stats__label {
  color: var(--text-muted);
  font-size: var(--step--1);
  line-height: 1.45;
  text-wrap: balance;
}
</style>
