<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const localePath = useLocalePath()
const { tx } = useLocalized()

const NAV_IDS = ['about', 'experience', 'projects', 'skills', 'contact'] as const

const { active } = useActiveSection([...NAV_IDS])

const route = useRoute()

const isMenuOpen = ref(false)
const burger = useTemplateRef<HTMLButtonElement>('burger')
const nav = useTemplateRef<HTMLElement>('nav')

function closeMenu(returnFocus = false) {
  if (!isMenuOpen.value) return
  isMenuOpen.value = false
  if (returnFocus) burger.value?.focus()
}

// Escape закрывает меню и возвращает фокус на кнопку, которая его открыла
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu(true)
}

// Меню — не модальное: фокус не перехватываем. Но раз внимание ушло за его
// пределы, оставлять `aria-expanded="true"` значит врать о состоянии.
// pointerdown, а не click — меню закрывается раньше, чем клик доберётся
// до содержимого под ним.
function onPointerdown(event: PointerEvent) {
  const target = event.target as Node | null
  if (target && (nav.value?.contains(target) || burger.value?.contains(target))) return
  closeMenu()
}

watch(() => route.fullPath, () => closeMenu())

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerdown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerdown)
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-border bg-bg-veil backdrop-blur-[14px]">
    <div class="container flex min-h-(--header-height) items-center gap-m">
      <NuxtLink
        class="me-auto inline-flex items-center gap-2 font-strong whitespace-nowrap text-fg no-underline"
        :to="localePath('index')"
      >
        <span
          class="grid size-8 place-items-center rounded-s bg-accent text-[0.8rem] font-bold tracking-[0.02em] text-accent-contrast"
          aria-hidden="true"
        >BK</span>
        <span :class="[$style.name, 'text-base']" data-testid="brand-name">{{ tx(profile.name) }}</span>
      </NuxtLink>

      <nav
        id="site-menu"
        ref="nav"
        :class="$style.nav"
        :data-open="isMenuOpen ? '' : undefined"
        :aria-label="t('a11y.sectionsNav')"
      >
        <ul :class="[$style.list, 'flex']">
          <li v-for="id in NAV_IDS" :key="id">
            <a
              :class="[$style.link, 'inline-flex items-center font-emphasis no-underline transition-colors']"
              :href="`#${id}`"
              :aria-current="active === id ? 'location' : undefined"
              @click="closeMenu()"
            >
              {{ t(`nav.${id}`) }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-xs">
        <LocaleSwitcher />
        <ThemeToggle />

        <button
          ref="burger"
          type="button"
          :class="[
            $style.burger,
            'size-11 cursor-pointer items-center justify-center rounded-pill border border-border-interactive bg-transparent text-muted hover:border-accent hover:text-accent',
          ]"
          :aria-expanded="isMenuOpen"
          aria-controls="site-menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <AppIcon :name="isMenuOpen ? 'close' : 'menu'" :size="22" />
          <span class="sr-only">{{ isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu') }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style module lang="scss" src="./AppHeader.module.scss"></style>
