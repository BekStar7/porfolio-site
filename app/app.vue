<script setup lang="ts">
/**
 * `useLocaleHead` проставляет lang/dir на <html>, canonical и hreflang-альтернативы
 * для всех языков — это основа многоязычного SEO.
 */
const i18nHead = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
