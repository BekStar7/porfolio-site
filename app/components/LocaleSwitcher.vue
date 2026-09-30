<script setup lang="ts">
/**
 * Переключатель языка — настоящие ссылки на локализованные URL,
 * а не кнопки: работает без JS, индексируется и попадает в hreflang.
 */
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <nav :aria-label="t('locale.label')">
    <ul class="flex items-center gap-0.5 rounded-pill border border-border-interactive p-1">
      <li v-for="item in locales" :key="item.code">
        <NuxtLink
          :class="[
            $style.link,
            'inline-flex min-h-9 min-w-10 items-center justify-center rounded-pill px-2 text-sm font-semibold tracking-[0.04em] no-underline transition-colors',
          ]"
          :to="switchLocalePath(item.code)"
          :hreflang="item.language"
          :aria-current="item.code === locale ? 'true' : undefined"
        >
          <span aria-hidden="true">{{ item.code.toUpperCase() }}</span>
          <!-- Название языка — на самом языке, с правильным lang,
               чтобы синтезатор речи произнёс его верно. -->
          <span class="sr-only" :lang="item.code">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style module lang="scss" src="./LocaleSwitcher.module.scss"></style>
