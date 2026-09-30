<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="education" class="section" tabindex="-1" aria-labelledby="education-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow" aria-hidden="true">05</p>
        <h2 id="education-title">{{ t('sections.education') }}</h2>
      </div>

      <div :class="[$style.education, 'grid gap-xl md:items-start md:gap-2xl']">
        <section aria-labelledby="degrees-title">
          <h3
            id="degrees-title"
            class="mb-m text-sm font-semibold tracking-[0.08em] text-subtle uppercase"
          >
            {{ t('education.degrees') }}
          </h3>
          <ul class="grid gap-s">
            <li v-for="entry in profile.education" :key="entry.id" class="card px-l py-m">
              <p class="font-semibold">{{ tx(entry.degree) }} — {{ tx(entry.field) }}</p>
              <p class="mt-1 text-sm text-muted">{{ tx(entry.institution) }}</p>
              <p class="mt-1 flex gap-[0.4ch] text-sm text-subtle tabular-nums">
                <time :datetime="entry.start">{{ entry.start }}</time>
                <span aria-hidden="true">–</span>
                <time :datetime="entry.end">{{ entry.end }}</time>
              </p>
            </li>
          </ul>
        </section>

        <section aria-labelledby="languages-title">
          <h3
            id="languages-title"
            class="mb-m text-sm font-semibold tracking-[0.08em] text-subtle uppercase"
          >
            {{ t('education.languages') }}
          </h3>
          <ul class="card grid px-l py-xs">
            <li
              v-for="(language, index) in profile.languages"
              :key="language.id"
              :class="[
                $style.language,
                'grid items-center gap-x-m gap-y-1 py-m',
                { 'border-t border-border': index > 0 },
              ]"
            >
              <span class="font-semibold">{{ tx(language.name) }}</span>
              <span class="row-start-2 text-sm text-subtle">{{ tx(language.level) }}</span>
              <!-- Шкала дублирует текст уровня, поэтому скрыта от скринридера -->
              <span
                class="col-start-2 row-[1/span_2] flex gap-1"
                data-testid="language-meter"
                aria-hidden="true"
              >
                <span
                  v-for="step in 5"
                  :key="step"
                  class="size-2 rounded-full bg-border-strong data-filled:bg-accent"
                  :data-filled="step <= language.proficiency ? '' : undefined"
                />
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./EducationSection.module.scss"></style>
