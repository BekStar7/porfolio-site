<script setup lang="ts">
import { profile } from '~/data/profile'
import type { Role } from '~~/shared/types/profile'

const { t } = useI18n()
const { tx, code } = useLocalized()

/** «2 г. 2 мес.» — без склонений, поэтому правила множественного числа не нужны. */
function durationLabel(role: Role): string {
  const { years, months } = splitDuration(monthsBetween(role.start, role.end))

  if (years && months) return t('experience.duration', { years, months })
  if (years) return t('experience.durationYears', { years })
  return t('experience.durationMonths', { months })
}
</script>

<template>
  <section id="experience" class="section" tabindex="-1" aria-labelledby="experience-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow" aria-hidden="true">02</p>
        <h2 id="experience-title">{{ t('sections.experience') }}</h2>
      </div>

      <!-- Упорядоченный список: порядок мест работы несёт смысл -->
      <ol class="timeline">
        <li v-for="job in profile.experience" :key="job.id" class="timeline__item">
          <span class="timeline__dot" aria-hidden="true" />

          <div class="job">
            <div class="job__head">
              <h3 class="job__company">
                <AppLink v-if="job.href" :href="job.href">{{ job.company }}</AppLink>
                <template v-else>{{ job.company }}</template>
                <span v-if="job.note" class="job__note">{{ job.note }}</span>
              </h3>
              <p class="job__location">{{ tx(job.location) }}</p>
            </div>

            <ol class="roles">
              <li v-for="role in job.roles" :key="role.start" class="role">
                <h4 class="role__title">{{ tx(role.title) }}</h4>

                <p class="role__period">
                  <time :datetime="toDateTimeAttr(role.start)">
                    {{ formatYearMonth(role.start, code) }}
                  </time>
                  <span aria-hidden="true">–</span>
                  <time v-if="role.end" :datetime="toDateTimeAttr(role.end)">
                    {{ formatYearMonth(role.end, code) }}
                  </time>
                  <span v-else>{{ t('experience.present') }}</span>
                  <span class="role__duration">· {{ durationLabel(role) }}</span>
                </p>

                <ul class="role__highlights">
                  <li v-for="(highlight, index) in tx(role.highlights)" :key="index">
                    {{ highlight }}
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </li>
      </ol>

      <!-- Опыт до фронтенда: одной строкой на место, без списка задач.
           Закрывает пробел в хронологии, не перетягивая внимание. -->
      <section class="early" aria-labelledby="early-title">
        <h3 id="early-title" class="early__title">{{ t('experience.earlyTitle') }}</h3>
        <p class="early__note">{{ t('experience.earlyNote') }}</p>

        <ol class="early__list">
          <li v-for="role in profile.earlyCareer" :key="role.id" class="early__item">
            <span class="early__dot" aria-hidden="true" />

            <p class="early__role">
              {{ tx(role.role) }}
              <span class="early__company">{{ tx(role.company) }}</span>
            </p>

            <p class="early__period">
              <time :datetime="toDateTimeAttr(role.start)">
                {{ formatYearMonth(role.start, code) }}
              </time>
              <span aria-hidden="true">–</span>
              <time :datetime="toDateTimeAttr(role.end)">
                {{ formatYearMonth(role.end, code) }}
              </time>
            </p>

            <p class="early__summary">{{ tx(role.summary) }}</p>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  display: grid;
  gap: var(--space-2xl);
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__item {
  position: relative;
  padding-inline-start: var(--space-xl);
}

/* Линия времени — чистое оформление, поэтому рисуется псевдоэлементом */
.timeline__item::before {
  content: '';
  position: absolute;
  inset-inline-start: 4px;
  inset-block: 0.75rem -2.5rem;
  width: 2px;
  background: var(--border);
}

.timeline__item:last-child::before {
  display: none;
}

.timeline__dot {
  position: absolute;
  inset-inline-start: 0;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-veil);
}

.job__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem var(--space-m);
}

.job__company {
  font-size: var(--step-2);
}

.job__note {
  margin-inline-start: 0.5ch;
  color: var(--text-subtle);
  font-size: var(--step-0);
  font-weight: 500;
}

.job__note::before {
  content: '· ';
}

.job__location {
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.roles {
  display: grid;
  gap: var(--space-l);
  margin: var(--space-l) 0 0;
  padding: 0;
  list-style: none;
}

.role {
  padding: var(--space-l);
  border: 1px solid var(--border);
  border-radius: var(--radius-m);
  background: var(--surface);
}

.role__title {
  font-size: var(--step-1);
  font-weight: 650;
}

.role__period {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4ch;
  margin-block-start: 0.25rem;
  color: var(--text-subtle);
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
}

/* Без дополнительной прозрачности: она опускала контраст ниже 4.5:1 */
.role__duration {
  color: var(--text-subtle);
}

.role__highlights {
  display: grid;
  gap: var(--space-s);
  margin-block-start: var(--space-m);
  padding: 0;
  list-style: none;
  color: var(--text-muted);
}

.role__highlights > li {
  position: relative;
  padding-inline-start: 1.5rem;
  line-height: 1.6;
}

/* Маркер декоративный: смысл списка уже передан элементами <ul>/<li> */
.role__highlights > li::before {
  content: '';
  position: absolute;
  inset-inline-start: 0.25rem;
  top: 0.68em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.75;
}

/* ---- Опыт до фронтенда ---- */

.early {
  margin-block-start: var(--space-2xl);
  padding-block-start: var(--space-xl);
  border-block-start: 1px solid var(--border);
}

.early__title {
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.early__note {
  margin-block-start: var(--space-2xs);
  max-width: var(--measure);
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.early__list {
  display: grid;
  gap: var(--space-m);
  margin: var(--space-l) 0 0;
  padding: 0;
  list-style: none;
}

.early__item {
  position: relative;
  display: grid;
  gap: 0.25rem;
  padding-inline-start: var(--space-xl);
}

/* Полый маркер — визуально слабее, чем заполненные точки основного таймлайна */
.early__dot {
  position: absolute;
  inset-inline-start: 1px;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border: 2px solid var(--border-interactive);
  border-radius: 50%;
}

.early__role {
  font-weight: 600;
  color: var(--text);
}

.early__company {
  color: var(--text-muted);
  font-weight: 400;
}

.early__company::before {
  content: '· ';
}

.early__period {
  display: flex;
  gap: 0.4ch;
  color: var(--text-subtle);
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
}

.early__summary {
  max-width: var(--measure);
  color: var(--text-muted);
  font-size: var(--step--1);
  line-height: 1.6;
}

@media (min-width: 44rem) {
  .early__item {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .early__period {
    grid-column: 2;
    grid-row: 1;
    justify-content: end;
  }

  .early__summary {
    grid-column: 1;
  }
}
</style>
