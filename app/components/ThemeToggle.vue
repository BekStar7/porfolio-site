<script setup lang="ts">
const { t } = useI18n()
const { toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="inline-flex size-11 cursor-pointer items-center justify-center rounded-pill border border-border-interactive bg-transparent text-muted transition-colors hover:border-accent hover:bg-accent-veil hover:text-accent"
    @click="toggle"
  >
    <!-- Обе пары «иконка + название действия» есть в разметке всегда,
         лишнюю скрывает CSS по активной теме: display:none убирает её
         и из дерева доступности, поэтому скринридер читает ровно одну. -->
    <span class="inline-flex items-center justify-center light:hidden">
      <AppIcon name="sun" :size="18" />
    </span>
    <span class="hidden items-center justify-center light:inline-flex">
      <AppIcon name="moon" :size="18" />
    </span>

    <span class="sr-only inline-flex light:hidden">{{ t('theme.toLight') }}</span>
    <span class="sr-only hidden light:inline-flex">{{ t('theme.toDark') }}</span>
  </button>
</template>
