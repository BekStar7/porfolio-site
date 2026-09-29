/**
 * Подсвечивает в навигации раздел, который сейчас на экране.
 *
 * Наблюдение начинается только после монтирования, поэтому серверная и
 * клиентская разметка совпадают, а `aria-current` появляется уже после
 * гидратации.
 */
export function useActiveSection(ids: string[]) {
  const active = ref<string | null>(null)

  onMounted(() => {
    if (!('IntersectionObserver' in window)) return

    const visible = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting)
        // ids идут в порядке документа — берём самый верхний видимый раздел
        active.value = ids.find(id => visible.get(id)) ?? active.value
      },
      // Узкая полоса по центру экрана: активным считается раздел,
      // который читатель действительно смотрит.
      { rootMargin: '-45% 0px -50% 0px' },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    onBeforeUnmount(() => observer.disconnect())
  })

  return { active }
}
