<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section :class="[$style.hero, 'relative overflow-clip']" aria-labelledby="hero-title">
    <!-- Декоративное свечение: вне дерева доступности и не влияет на контраст текста -->
    <div :class="$style.glow" aria-hidden="true" />

    <div class="container relative">
      <p class="inline-flex items-center gap-2 rounded-pill border border-border bg-surface py-1 pr-4 pl-3 text-sm text-muted">
        <span class="size-2 rounded-full bg-accent ring-3 ring-accent-veil" aria-hidden="true" />
        {{ tx(profile.availability) }}
      </p>

      <p class="mt-xl text-base text-subtle">{{ t('hero.greeting') }}</p>

      <h1 id="hero-title" class="mt-2xs flex flex-col gap-1">
        <span>{{ tx(profile.name) }}</span>
        <span class="text-xl font-semibold tracking-[-0.01em] text-accent">{{ tx(profile.role) }}</span>
      </h1>

      <p class="mt-l max-w-[44ch] text-lg leading-[1.55] text-muted">{{ tx(profile.tagline) }}</p>

      <p class="mt-m flex items-center gap-2 text-sm text-subtle">
        <AppIcon name="pin" :size="17" />
        {{ tx(profile.location) }}
      </p>

      <div class="mt-xl flex flex-wrap gap-s">
        <a class="btn btn-primary gap-2" href="#contact">
          {{ t('hero.ctaContact') }}
          <AppIcon name="arrowRight" :size="18" />
        </a>
        <a class="btn btn-ghost" href="#projects">{{ t('hero.ctaProjects') }}</a>
      </div>

      <ul class="mt-l flex flex-wrap gap-x-l gap-y-s" :aria-label="t('a11y.socialLinks')">
        <li v-for="social in profile.socials" :key="social.id">
          <AppLink
            class="min-h-11 text-sm text-muted no-underline hover:text-accent"
            :href="social.href"
            :show-icon="false"
          >
            <AppIcon :name="social.icon as never" :size="18" />
            <span>{{ social.handle }}</span>
          </AppLink>
        </li>
      </ul>

      <ul
        :class="[$style.stats, 'mt-2xl grid gap-px overflow-hidden rounded-m border border-border bg-border']"
        :aria-label="t('hero.statsLabel')"
      >
        <li v-for="stat in profile.stats" :key="stat.id" class="flex flex-col gap-1 bg-surface px-m py-l">
          <span class="text-2xl font-bold tracking-[-0.03em] tabular-nums">{{ tx(stat.value) }}</span>
          <span class="text-sm leading-[1.45] text-balance text-muted">{{ tx(stat.label) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style module lang="scss" src="./HeroSection.module.scss"></style>
