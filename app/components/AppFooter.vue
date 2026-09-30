<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()

// Год берём из сборки, а не из Date в браузере: иначе первого января
// серверная и клиентская разметка разошлись бы.
const { buildYear } = useRuntimeConfig().public
</script>

<template>
  <footer class="border-t border-border py-xl">
    <div class="container flex flex-wrap items-center justify-between gap-x-l gap-y-s text-sm text-subtle">
      <p>
        {{ t('footer.rights', { year: buildYear, name: tx(profile.name) }) }}
      </p>

      <p>{{ t('footer.builtWith', { version: '4' }) }}</p>

      <a
        class="inline-flex min-h-11 items-center gap-2 rounded-pill border border-border-interactive px-m text-muted no-underline transition-colors hover:border-accent hover:text-accent"
        href="#top"
        :aria-label="t('a11y.backToTop')"
      >
        <AppIcon name="arrowUp" :size="16" />
        {{ t('nav.top') }}
      </a>
    </div>
  </footer>
</template>
