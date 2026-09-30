<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="projects" class="section" tabindex="-1" aria-labelledby="projects-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow" aria-hidden="true">03</p>
        <h2 id="projects-title">{{ t('sections.projects') }}</h2>
      </div>

      <ul :class="[$style.projects, 'grid gap-m']">
        <li v-for="(project, index) in profile.projects" :key="project.id" :class="{ 'md:col-span-full': index === 0 }">
          <!-- Выделенный проект от 56rem: граница и градиент поверх цвета карточки -->
          <article
            :class="[
              'card flex h-full flex-col gap-s p-l transition-colors hover:border-border-strong',
              { [`${$style.featured} md:border-border-strong`]: index === 0 },
            ]"
            :data-testid="index === 0 ? 'project-featured' : undefined"
          >
            <div class="flex flex-wrap items-baseline justify-between gap-xs">
              <h3 :class="index === 0 ? 'text-lg md:text-xl' : 'text-lg'">{{ tx(project.title) }}</h3>
              <p class="text-sm whitespace-nowrap text-subtle tabular-nums">{{ project.period }}</p>
            </div>

            <p class="leading-[1.5] font-emphasis text-fg">{{ tx(project.summary) }}</p>
            <p class="max-w-(--measure) text-sm leading-[1.65] text-muted">{{ tx(project.description) }}</p>

            <p
              v-if="project.impact"
              class="max-w-(--measure) border-s-2 border-accent ps-m text-sm leading-[1.55] text-muted"
            >
              <!-- Подпись читается скринридером, визуально её заменяет акцентная рамка -->
              <span class="sr-only">{{ t('projects.impact') }}: </span>
              {{ tx(project.impact) }}
            </p>

            <ul class="tag-list mt-auto pt-xs" :aria-label="t('projects.stack')">
              <li v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</li>
            </ul>

            <div v-if="project.links.length" class="flex flex-wrap gap-xs pt-2xs">
              <AppLink
                v-for="link in project.links"
                :key="link.href"
                class="btn text-sm"
                :class="link.primary ? 'btn-primary' : 'btn-ghost'"
                :href="link.href"
              >
                {{ tx(link.label) }}
              </AppLink>
            </div>
            <p v-else class="pt-2xs text-sm text-subtle">{{ t('projects.noLinks') }}</p>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<style module lang="scss" src="./ProjectsSection.module.scss"></style>
