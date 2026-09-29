<script setup lang="ts">
/**
 * Переключатель языка — настоящие ссылки на локализованные URL,
 * а не кнопки: работает без JS, индексируется и попадает в hreflang.
 */
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <nav class="locale-switcher" :aria-label="t('locale.label')">
    <ul class="locale-switcher__list">
      <li v-for="item in locales" :key="item.code">
        <NuxtLink
          class="locale-switcher__link"
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

<style scoped>
.locale-switcher__list {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  margin: 0;
  list-style: none;
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-pill);
}

.locale-switcher__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.125rem;
  padding-inline: 0.5rem;
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: var(--step--1);
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: color var(--transition), background-color var(--transition);
}

.locale-switcher__link:hover {
  color: var(--text);
  background: var(--surface-2);
}

.locale-switcher__link[aria-current='true'] {
  background: var(--accent);
  color: var(--accent-contrast);
}
</style>
