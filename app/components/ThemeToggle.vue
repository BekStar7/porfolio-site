<script setup lang="ts">
const { t } = useI18n()
const { toggle } = useTheme()
</script>

<template>
  <button type="button" class="theme-toggle" @click="toggle">
    <!-- Обе пары «иконка + название действия» есть в разметке всегда,
         лишнюю скрывает CSS по активной теме: display:none убирает её
         и из дерева доступности, поэтому скринридер читает ровно одну. -->
    <span class="theme-toggle__icon inline-flex light:hidden">
      <AppIcon name="sun" :size="18" />
    </span>
    <span class="theme-toggle__icon hidden light:inline-flex">
      <AppIcon name="moon" :size="18" />
    </span>

    <span class="sr-only inline-flex light:hidden">{{ t('theme.toLight') }}</span>
    <span class="sr-only hidden light:inline-flex">{{ t('theme.toDark') }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition), border-color var(--transition),
    background-color var(--transition);
}

.theme-toggle:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: var(--accent-veil);
}

.theme-toggle__icon {
  align-items: center;
  justify-content: center;
}
</style>
