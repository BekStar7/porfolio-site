import type { LocaleCode, YearMonth } from '~~/shared/types/profile'

/**
 * Названия месяцев заданы явно, а не через Intl: на статике разметка
 * генерируется в Node, а гидрируется в браузере, и расхождение версий ICU
 * дало бы несовпадение разметки.
 */
const MONTHS: Record<LocaleCode, string[]> = {
  ru: ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

function parse(value: YearMonth): { year: number, month: number } {
  const [year, month] = value.split('-').map(Number)
  return { year: year ?? 0, month: month ?? 1 }
}

/** `2024-09` → «сент. 2024» / «Sep 2024» */
export function formatYearMonth(value: YearMonth, locale: LocaleCode): string {
  const { year, month } = parse(value)
  return `${MONTHS[locale][month - 1]} ${year}`
}

/** Значение для атрибута `datetime` у <time>: `2024-09` */
export function toDateTimeAttr(value: YearMonth): string {
  return value
}

/** Количество месяцев в периоде, включая начальный. */
export function monthsBetween(start: YearMonth, end: YearMonth | null): number {
  const from = parse(start)
  const to = end ? parse(end) : nowYearMonth()
  return Math.max(1, (to.year - from.year) * 12 + (to.month - from.month))
}

function nowYearMonth(): { year: number, month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

/** Разбивает длительность на годы и месяцы для подписи под должностью. */
export function splitDuration(totalMonths: number): { years: number, months: number } {
  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
  }
}
