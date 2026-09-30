<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="education" class="section" tabindex="-1" aria-labelledby="education-title">
    <div class="container">
      <div class="section__head">
        <p class="section__eyebrow" aria-hidden="true">05</p>
        <h2 id="education-title">{{ t('sections.education') }}</h2>
      </div>

      <div class="education">
        <section class="education__block" aria-labelledby="degrees-title">
          <h3 id="degrees-title" class="education__title">{{ t('education.degrees') }}</h3>
          <ul class="degrees">
            <li v-for="entry in profile.education" :key="entry.id" class="degree card">
              <p class="degree__name">{{ tx(entry.degree) }} — {{ tx(entry.field) }}</p>
              <p class="degree__place">{{ tx(entry.institution) }}</p>
              <p class="degree__years">
                <time :datetime="entry.start">{{ entry.start }}</time>
                <span aria-hidden="true">–</span>
                <time :datetime="entry.end">{{ entry.end }}</time>
              </p>
            </li>
          </ul>
        </section>

        <section class="education__block" aria-labelledby="languages-title">
          <h3 id="languages-title" class="education__title">{{ t('education.languages') }}</h3>
          <ul class="languages card">
            <li v-for="language in profile.languages" :key="language.id" class="language">
              <span class="language__name">{{ tx(language.name) }}</span>
              <span class="language__level">{{ tx(language.level) }}</span>
              <!-- Шкала дублирует текст уровня, поэтому скрыта от скринридера -->
              <span class="language__meter" data-testid="language-meter" aria-hidden="true">
                <span
                  v-for="step in 5"
                  :key="step"
                  class="language__step"
                  :class="{ 'is-filled': step <= language.proficiency }"
                />
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.education {
  display: grid;
  gap: var(--space-xl);
}

@media (min-width: 56rem) {
  .education {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--space-2xl);
    align-items: start;
  }
}

.education__title {
  margin-block-end: var(--space-m);
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.degrees {
  display: grid;
  gap: var(--space-s);
  margin: 0;
  padding: 0;
  list-style: none;
}

.degree {
  padding: var(--space-m) var(--space-l);
}

.degree__name {
  font-weight: 600;
}

.degree__place {
  margin-block-start: 0.25rem;
  color: var(--text-muted);
  font-size: var(--step--1);
}

.degree__years {
  display: flex;
  gap: 0.4ch;
  margin-block-start: 0.25rem;
  color: var(--text-subtle);
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
}

.languages {
  display: grid;
  margin: 0;
  padding: var(--space-xs) var(--space-l);
  list-style: none;
}

.language {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.25rem var(--space-m);
  padding-block: var(--space-m);
}

.language + .language {
  border-block-start: 1px solid var(--border);
}

.language__name {
  font-weight: 600;
}

.language__level {
  grid-row: 2;
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.language__meter {
  display: flex;
  grid-row: 1 / span 2;
  grid-column: 2;
  gap: 4px;
}

.language__step {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-strong);
}

.language__step.is-filled {
  background: var(--accent);
}
</style>
