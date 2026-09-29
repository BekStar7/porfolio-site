export type ThemeName = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'portfolio-theme'

/**
 * Переключение темы.
 *
 * Чтобы не было вспышки светлого фона, атрибут `data-theme` выставляет
 * маленький синхронный скрипт в <head> (см. nuxt.config.ts) — ещё до первой
 * отрисовки. Здесь мы только подхватываем уже применённое значение.
 */
export function useTheme() {
  const theme = useState<ThemeName>('theme', () => 'dark')

  function apply(next: ThemeName) {
    theme.value = next
    if (!import.meta.client) return

    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    }
    catch {
      // localStorage может быть недоступен (приватный режим, блокировка) —
      // тема просто не переживёт перезагрузку.
    }
  }

  onMounted(() => {
    const applied = document.documentElement.dataset.theme
    if (applied === 'light' || applied === 'dark') theme.value = applied
  })

  /**
   * Текущую тему читаем из DOM, а не из состояния: атрибут ставит
   * скрипт в <head>, и он — источник правды даже если состояние
   * ещё не синхронизировалось.
   */
  function toggle() {
    const applied = document.documentElement.dataset.theme
    const current: ThemeName = applied === 'light' || applied === 'dark'
      ? applied
      : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'

    apply(current === 'dark' ? 'light' : 'dark')
  }

  return { theme: readonly(theme), toggle }
}
