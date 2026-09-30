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
      <ol class="grid gap-2xl">
        <li v-for="job in profile.experience" :key="job.id" :class="[$style.item, 'relative ps-xl']">
          <span
            class="absolute start-0 top-2 size-3 rounded-full bg-accent ring-4 ring-accent-veil"
            aria-hidden="true"
          />

          <div>
            <div class="flex flex-wrap items-baseline gap-x-m gap-y-1">
              <h3 class="text-xl">
                <AppLink v-if="job.href" :href="job.href">{{ job.company }}</AppLink>
                <template v-else>{{ job.company }}</template>
                <span
                  v-if="job.note"
                  :class="[$style.note, 'ms-[0.5ch] text-base font-medium text-subtle']"
                >{{ job.note }}</span>
              </h3>
              <p class="text-sm text-subtle">{{ tx(job.location) }}</p>
            </div>

            <ol class="mt-l grid gap-l">
              <li
                v-for="role in job.roles"
                :key="role.start"
                class="rounded-m border border-border bg-surface p-l"
              >
                <h4 class="text-lg font-strong">{{ tx(role.title) }}</h4>

                <p class="mt-1 flex flex-wrap gap-[0.4ch] text-sm text-subtle tabular-nums">
                  <time :datetime="toDateTimeAttr(role.start)">
                    {{ formatYearMonth(role.start, code) }}
                  </time>
                  <span aria-hidden="true">–</span>
                  <time v-if="role.end" :datetime="toDateTimeAttr(role.end)">
                    {{ formatYearMonth(role.end, code) }}
                  </time>
                  <span v-else>{{ t('experience.present') }}</span>
                  <!-- Без дополнительной прозрачности: она опускала контраст ниже 4.5:1 -->
                  <span>· {{ durationLabel(role) }}</span>
                </p>

                <ul class="mt-m grid gap-s text-muted">
                  <li
                    v-for="(highlight, index) in tx(role.highlights)"
                    :key="index"
                    :class="[$style.highlight, 'relative ps-6 leading-[1.6]']"
                  >
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
      <section class="mt-2xl border-t border-border pt-xl" aria-labelledby="early-title">
        <h3 id="early-title" class="text-sm font-semibold tracking-[0.08em] text-subtle uppercase">
          {{ t('experience.earlyTitle') }}
        </h3>
        <p class="mt-2xs max-w-(--measure) text-sm text-subtle">{{ t('experience.earlyNote') }}</p>

        <ol class="mt-l grid gap-m">
          <li v-for="role in profile.earlyCareer" :key="role.id" :class="[$style.earlyItem, 'relative grid gap-1 ps-xl']">
            <!-- Полый маркер — визуально слабее, чем заполненные точки основного таймлайна -->
            <span
              class="absolute start-px top-2 size-3 rounded-full border-2 border-border-interactive"
              aria-hidden="true"
            />

            <p class="font-semibold">
              {{ tx(role.role) }}
              <span :class="[$style.company, 'font-normal text-muted']">{{ tx(role.company) }}</span>
            </p>

            <p :class="[$style.earlyPeriod, 'flex gap-[0.4ch] text-sm text-subtle tabular-nums']">
              <time :datetime="toDateTimeAttr(role.start)">
                {{ formatYearMonth(role.start, code) }}
              </time>
              <span aria-hidden="true">–</span>
              <time :datetime="toDateTimeAttr(role.end)">
                {{ formatYearMonth(role.end, code) }}
              </time>
            </p>

            <p :class="[$style.earlySummary, 'max-w-(--measure) text-sm leading-[1.6] text-muted']">
              {{ tx(role.summary) }}
            </p>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>

<style module lang="scss" src="./ExperienceSection.module.scss"></style>
