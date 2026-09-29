<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()

// Год берём из сборки, а не из Date в браузере: иначе первого января
// серверная и клиентская разметка разошлись бы.
const { buildYear } = useRuntimeConfig().public
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <p class="footer__rights">
        {{ t('footer.rights', { year: buildYear, name: tx(profile.name) }) }}
      </p>

      <p class="footer__built">{{ t('footer.builtWith', { version: '4' }) }}</p>

      <a class="footer__top" href="#top">
        <AppIcon name="arrowUp" :size="16" />
        {{ t('nav.top') }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-block-start: 1px solid var(--border);
  padding-block: var(--space-xl);
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s) var(--space-l);
  color: var(--text-subtle);
  font-size: var(--step--1);
}

.footer__top {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  padding-inline: var(--space-m);
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition), border-color var(--transition);
}

.footer__top:hover {
  color: var(--accent);
  border-color: var(--accent);
}
</style>
