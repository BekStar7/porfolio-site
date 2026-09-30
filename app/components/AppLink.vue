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
    :class="[$style.link, 'inline-flex items-center']"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <template v-if="isExternal">
      <AppIcon v-if="showIcon" name="external" :size="14" :class="$style.icon" />
      <span class="sr-only"> ({{ t('a11y.opensInNewTab') }})</span>
    </template>
  </a>
</template>

<style module lang="scss" src="./AppLink.module.scss"></style>
