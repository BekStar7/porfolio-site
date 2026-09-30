<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <!-- Первый фокусируемый элемент страницы: позволяет клавиатуре
       пропустить шапку и сразу попасть в основное содержимое. -->
  <a
    :class="[
      $style.skip,
      'fixed top-m left-m z-100 rounded-s bg-accent px-5 py-3 font-semibold text-accent-contrast no-underline',
    ]"
    href="#main"
  >
    {{ t('a11y.skipToContent') }}
  </a>
</template>

<style module lang="scss" src="./SkipLink.module.scss"></style>
