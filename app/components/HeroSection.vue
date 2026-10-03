<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <!-- Декоративное свечение: вне дерева доступности и не влияет на контраст текста -->
    <div class="hero__glow" aria-hidden="true" />

    <div class="container hero__inner">
      <p class="hero__status">
        <span class="hero__dot" aria-hidden="true" />
        {{ tx(profile.availability) }}
      </p>

      <p class="hero__greeting">{{ t('hero.greeting') }}</p>

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

.hero__glow {
  position: absolute;
  inset: -20% 0 auto;
  height: 42rem;
  background: var(--glow);
  pointer-events: none;
}

.hero__inner {
  position: relative;
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

.hero__greeting {
  margin-block-start: var(--space-xl);
  color: var(--text-subtle);
  font-size: var(--step-0);
}

.hero__title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-block-start: var(--space-2xs);
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
  gap: var(--space-s);
  margin-block-start: var(--space-xl);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
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
  padding: var(--space-l) var(--space-m);
  background: var(--surface);
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
