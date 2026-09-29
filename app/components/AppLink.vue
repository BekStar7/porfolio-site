<script setup lang="ts">
/**
 * Ссылка, которая сама решает, внешняя она или нет, и честно сообщает
 * об открытии в новой вкладке — видимой иконкой и текстом для скринридера.
 */
const { href, showIcon = true } = defineProps<{
  href: string
  showIcon?: boolean
}>()

const { t } = useI18n()

const isExternal = computed(() => /^https?:\/\//i.test(href))
</script>

<template>
  <a
    class="app-link"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <template v-if="isExternal">
      <AppIcon v-if="showIcon" name="external" :size="14" class="app-link__icon" />
      <span class="sr-only"> ({{ t('a11y.opensInNewTab') }})</span>
    </template>
  </a>
</template>

<style scoped>
.app-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
}

.app-link__icon {
  opacity: 0.7;
  transition: opacity var(--transition);
}

.app-link:hover .app-link__icon {
  opacity: 1;
}
</style>
