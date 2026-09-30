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

      <div :class="[$style.about, 'grid gap-xl md:items-start md:gap-2xl']">
        <div class="prose text-base text-muted">
          <p
            v-for="(paragraph, index) in tx(profile.about)"
            :key="index"
            :class="{ 'text-lg leading-[1.55] text-fg': index === 0 }"
          >
            {{ paragraph }}
          </p>
        </div>

        <div class="grid gap-l">
          <figure class="card relative grid gap-s p-l">
            <AppIcon name="quote" :size="22" class="text-accent opacity-85" />
            <blockquote
              class="text-lg leading-[1.45] font-emphasis tracking-[-0.01em] text-pretty"
              :cite="profile.quote.href"
            >
              {{ tx(profile.quote.text) }}
            </blockquote>
            <figcaption class="text-sm text-subtle">
              {{ tx(profile.quote.context) }}
            </figcaption>
          </figure>

          <div>
            <h3 class="text-sm font-semibold tracking-[0.08em] text-subtle uppercase">{{ t('about.pressTitle') }}</h3>
            <article
              v-for="item in profile.press"
              :key="item.id"
              class="mt-s border-s-2 border-border-strong ps-m"
            >
              <h4 class="text-base leading-[1.35] font-semibold">
                <AppLink :href="item.href">{{ tx(item.title) }}</AppLink>
              </h4>
              <p class="mt-1 text-sm text-subtle">
                {{ item.outlet }} ·
                <time :datetime="item.date">{{ item.date.slice(0, 4) }}</time>
              </p>
              <p v-if="item.quote" class="mt-xs text-sm leading-[1.5] text-muted">«{{ tx(item.quote) }}»</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./AboutSection.module.scss"></style>
