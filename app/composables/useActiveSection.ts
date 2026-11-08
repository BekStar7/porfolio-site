/**
 * Раздел, который сейчас на экране, — для подсветки пункта в навигации.
 *
 * Состояние общее, а наблюдает за разделами страница, не шапка: шапка живёт
 * в layout и переживает смену языка, а разделы монтируются заново вместе со
 * страницей. Наблюдатель, привязанный к жизни страницы, всегда смотрит на
 * текущие узлы, а не на отсоединённые от документа.
 *
 * Наблюдение начинается только после монтирования, поэтому серверная и
 * клиентская разметка совпадают, а `aria-current` появляется уже после
 * гидратации.
 */

/** Разделы, у которых есть пункт в навигации, — в порядке документа. */
export const NAV_SECTION_IDS = ['about', 'experience', 'projects', 'skills', 'contact'] as const

export type NavSectionId = (typeof NAV_SECTION_IDS)[number]

/** Для шапки: какой раздел подсветить. `null` — ни один. */
export function useActiveSection() {
  const active = useState<NavSectionId | null>('active-section', () => null)
  return { active: readonly(active) }
}

/** Для страницы: следит за разделами, пока она смонтирована. */
export function useActiveSectionObserver() {
  const active = useState<NavSectionId | null>('active-section', () => null)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    active.value = null
    if (!('IntersectionObserver' in window)) return

    const visible = new Map<string, boolean>()

    observer = new IntersectionObserver(
      (entries) => {
        // Отложенный колбэк уже размонтированной страницы не должен
        // перезаписать то, что увидел наблюдатель новой.
        if (!observer) return

        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        // Берём самый верхний видимый раздел. Если в полосе раздел без пункта
        // меню (hero, «Образование»), не подсвечиваем ничего: прошлый раздел
        // уже не «текущий».
        active.value = NAV_SECTION_IDS.find(id => visible.get(id)) ?? null
      },
      // Узкая полоса по центру экрана: активным считается раздел,
      // который читатель действительно смотрит.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    for (const id of NAV_SECTION_IDS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = undefined
  })
}
