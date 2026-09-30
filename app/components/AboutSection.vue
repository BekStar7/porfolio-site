<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="about" class="section" tabindex="-1" aria-labelledby="about-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow" aria-hidden="true">01</p>
        <h2 id="about-title">{{ t('sections.about') }}</h2>
      </div>

      <div class="about">
        <div class="about__text prose">
          <p v-for="(paragraph, index) in tx(profile.about)" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <div class="about__aside">
          <figure class="quote card">
            <AppIcon name="quote" :size="22" class="quote__mark" />
            <blockquote class="quote__text" :cite="profile.quote.href">
              {{ tx(profile.quote.text) }}
            </blockquote>
            <figcaption class="quote__source">
              {{ tx(profile.quote.context) }}
            </figcaption>
          </figure>

          <div class="press">
            <h3 class="press__title">{{ t('about.pressTitle') }}</h3>
            <article v-for="item in profile.press" :key="item.id" class="press__item">
              <h4 class="press__heading">
                <AppLink :href="item.href">{{ tx(item.title) }}</AppLink>
              </h4>
              <p class="press__meta">
                {{ item.outlet }} ·
                <time :datetime="item.date">{{ item.date.slice(0, 4) }}</time>
              </p>
              <p v-if="item.quote" class="press__quote">«{{ tx(item.quote) }}»</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  gap: var(--space-xl);
}

@media (min-width: 56rem) {
  .about {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    gap: var(--space-2xl);
    align-items: start;
  }
}

.about__text {
  font-size: var(--step-0);
  color: var(--text-muted);
}

.about__text > p:first-child {
  color: var(--text);
  font-size: var(--step-1);
  line-height: 1.55;
}

.about__aside {
  display: grid;
  gap: var(--space-l);
}

.quote {
  position: relative;
  margin: 0;
  padding: var(--space-l);
  display: grid;
  gap: var(--space-s);
}

.quote__mark {
  color: var(--accent);
  opacity: 0.85;
}

.quote__text {
  margin: 0;
  font-size: var(--step-1);
  line-height: 1.45;
  font-weight: 550;
  letter-spacing: -0.01em;
  text-wrap: pretty;
}

.quote__source {
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.press__title {
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.press__item {
  margin-block-start: var(--space-s);
  padding-inline-start: var(--space-m);
  border-inline-start: 2px solid var(--border-strong);
}

.press__heading {
  font-size: var(--step-0);
  font-weight: 600;
  line-height: 1.35;
}

.press__meta {
  margin-block-start: 0.25rem;
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.press__quote {
  margin-block-start: var(--space-xs);
  color: var(--text-muted);
  font-size: var(--step--1);
  line-height: 1.5;
}
</style>
