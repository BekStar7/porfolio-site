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
  <header class="header">
    <div class="container header__inner">
      <NuxtLink class="header__brand" :to="localePath('index')">
        <span class="header__mark" aria-hidden="true">BK</span>
        <span class="header__name" data-testid="brand-name">{{ tx(profile.name) }}</span>
      </NuxtLink>

      <nav
        id="site-menu"
        ref="nav"
        class="header__nav"
        :class="{ 'is-open': isMenuOpen }"
        :aria-label="t('a11y.sectionsNav')"
      >
        <ul class="header__list">
          <li v-for="id in NAV_IDS" :key="id">
            <a
              class="header__link"
              :href="`#${id}`"
              :aria-current="active === id ? 'location' : undefined"
              @click="closeMenu()"
            >
              {{ t(`nav.${id}`) }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <LocaleSwitcher />
        <ThemeToggle />

        <button
          ref="burger"
          type="button"
          class="header__burger"
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

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-veil);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(14px);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-m);
  min-height: var(--header-height);
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-inline-end: auto;
  color: var(--text);
  font-weight: 650;
  text-decoration: none;
  white-space: nowrap;
}

.header__mark {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-s);
  background: var(--accent);
  color: var(--accent-contrast);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.header__name {
  font-size: var(--step-0);
}

.header__list {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.header__link {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding-inline: 0.75rem;
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: var(--step--1);
  font-weight: 550;
  text-decoration: none;
  transition: color var(--transition), background-color var(--transition);
}

.header__link:hover {
  color: var(--text);
  background: var(--surface-2);
}

.header__link[aria-current='location'] {
  color: var(--accent);
  background: var(--accent-veil);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.header__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--border-interactive);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.header__burger:hover {
  color: var(--accent);
  border-color: var(--accent);
}

@media (max-width: 62rem) {
  /*
   * На узких экранах имя убирается визуально, но остаётся в дереве
   * доступности: display:none лишил бы ссылку-логотип доступного имени,
   * и она стала бы для скринридера безымянной.
   */
  .header__name {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .header__burger {
    display: inline-flex;
  }

  /* Закрытое меню скрыто через display:none — значит, его нет ни в
     порядке табуляции, ни в дереве доступности. */
  .header__nav {
    display: none;
  }

  .header__nav.is-open {
    display: block;
    position: absolute;
    inset-inline: 0;
    top: 100%;
    padding: var(--space-xs);
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
  }

  .header__list {
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
  }

  .header__link {
    min-height: 3rem;
    padding-inline: var(--space-m);
    border-radius: var(--radius-s);
    font-size: var(--step-0);
  }
}
</style>
