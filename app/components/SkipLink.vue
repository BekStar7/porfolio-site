<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <!-- Первый фокусируемый элемент страницы: позволяет клавиатуре
       пропустить шапку и сразу попасть в основное содержимое. -->
  <a class="skip-link" href="#main">{{ t('a11y.skipToContent') }}</a>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: var(--space-m);
  left: var(--space-m);
  z-index: 100;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-s);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  text-decoration: none;
  /* Прячем за краем экрана, но оставляем в потоке фокуса */
  transform: translateY(calc(-100% - var(--space-m) - 4px));
  transition: transform var(--transition);
}

.skip-link:focus-visible {
  transform: translateY(0);
  color: var(--accent-contrast);
}
</style>
