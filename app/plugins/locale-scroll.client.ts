/**
 * Смена языка не прокручивает страницу в начало: читатель остаётся там же.
 *
 * Для роутера / и /en — разные маршруты, поэтому Nuxt по умолчанию
 * прокрутил бы страницу наверх. Просто сохранить пиксели прокрутки мало:
 * русский текст длиннее английского, и к «Контактам» расхождение доходит
 * до сотен пикселей. Поэтому запоминаем раздел у верхнего края экрана и
 * долю, на которую он уже прокручен, а после смены языка возвращаемся
 * в ту же точку того же раздела.
 */
interface ScrollAnchor {
  /** Порядковый номер раздела: разметка разделов на всех языках одинакова */
  index: number
  /** 0 — верх раздела у края экрана, 1 — раздел уже прокручен целиком */
  progress: number
}

function sections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('#top > section')]
}

function pageTop(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY
}

function captureAnchor(): ScrollAnchor | null {
  const y = window.scrollY
  if (y === 0) return null

  // Выше первого раздела (под шапкой) считаем, что читатель в первом
  const index = Math.max(0, sections().findLastIndex(section => pageTop(section) <= y))
  const section = sections()[index]
  if (!section) return null

  return { index, progress: (y - pageTop(section)) / section.offsetHeight }
}

function restoreAnchor({ index, progress }: ScrollAnchor) {
  const section = sections()[index]
  if (!section) return

  // `instant`: у html стоит scroll-behavior: smooth, а здесь нужен не
  // переход, а то же место на другом языке
  window.scrollTo({
    top: pageTop(section) + progress * section.offsetHeight,
    behavior: 'instant',
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  let anchor: ScrollAnchor | null = null
  let isSwitching = false

  // Хук i18n срабатывает до того, как текст сменится, — позже, в guard'е
  // роутера, страница может быть уже перерисована на новом языке
  nuxtApp.hook('i18n:beforeLocaleSwitch', ({ initialSetup }) => {
    if (initialSetup) return
    isSwitching = true
    anchor = captureAnchor()
  })

  useRouter().beforeEach((to) => {
    // Отключает прокрутку наверх в стандартном scrollBehavior Nuxt —
    // так же, как setPageLayout меняет `to.meta.layout` из middleware
    if (isSwitching) to.meta.scrollToTop = false
  })

  // Тот же момент, которого ждёт стандартный scrollBehavior Nuxt:
  // навигация завершена, текст на новом языке
  nuxtApp.hook('page:loading:end', () => {
    const saved = anchor
    isSwitching = false
    anchor = null
    if (saved) requestAnimationFrame(() => restoreAnchor(saved))
  })
})
