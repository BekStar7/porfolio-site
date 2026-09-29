import { expect, test } from '@playwright/test'
import { DESKTOP, LOCALES } from '../support/surfaces'
import { openSurface } from '../support/harness'
import { ariaTree, nodesByRole } from '../support/aria'

/**
 * Ориентиры и заголовки — это оглавление страницы для скринридера: по ним
 * переходят вместо чтения подряд. Структура не зависит ни от темы, ни от
 * ширины, но зависит от локали (имена ориентиров переводятся), поэтому
 * проверяется на каждой локали при развёрнутой шапке — на мобильной ширине
 * меню скрыто, и это отдельная проверка (см. keyboard-тесты).
 */
for (const locale of LOCALES) {
  const surface = { locale, theme: 'light' as const, viewport: DESKTOP }

  test.describe(`structure · ${locale.code}`, () => {
    test.use({ locale: locale.language })

    test('exposes exactly one banner, main and contentinfo', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      // Ровно один: два ориентира одного вида без имён неразличимы,
      // а ни одного — значит переходить не к чему.
      await expect(page.getByRole('banner')).toHaveCount(1)
      await expect(page.getByRole('main')).toHaveCount(1)
      await expect(page.getByRole('contentinfo')).toHaveCount(1)
    })

    test('names every navigation landmark uniquely', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      const navigations = nodesByRole(await ariaTree(page), 'navigation')

      // На этой ширине их два: разделы страницы и переключатель языка.
      expect(navigations.length).toBeGreaterThan(1)

      const names = navigations.map(node => node.name ?? '')
      expect(names, 'every navigation landmark needs an accessible name').not.toContain('')
      expect(new Set(names).size, `navigation names are not unique: ${names.join(', ')}`)
        .toBe(names.length)

      // То же утверждение, но через запрос по роли и имени: так проверяется,
      // что имя действительно адресует ровно один ориентир на живой странице.
      for (const name of names) {
        await expect(
          page.getByRole('navigation', { name, exact: true }),
          `navigation named "${name}" must be addressable and unique`,
        ).toHaveCount(1)
      }
    })

    test('has exactly one level-one heading', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      const headings = nodesByRole(await ariaTree(page), 'heading')
      const topLevel = headings.filter(node => node.level === 1)

      expect(
        topLevel.map(node => node.name),
        'the page needs exactly one h1 naming what it is about',
      ).toHaveLength(1)
    })

    test('does not skip heading levels', async ({ page, baseURL }) => {
      await openSurface(page, surface, baseURL!)

      const headings = nodesByRole(await ariaTree(page), 'heading')
      expect(headings.length).toBeGreaterThan(1)

      // Пропуск уровня (h2 → h4) читается как потерянный раздел: скринридер
      // сообщает о вложенности, которой в тексте нет.
      const skips = headings
        .map((node, index) => ({ node, previous: headings[index - 1] }))
        .filter(({ node, previous }) => previous && (node.level ?? 0) > (previous.level ?? 0) + 1)
        .map(({ node, previous }) =>
          `h${previous!.level} "${previous!.name}" → h${node.level} "${node.name}"`,
        )

      expect(skips, 'heading levels must not skip in document order').toEqual([])
    })
  })
}
