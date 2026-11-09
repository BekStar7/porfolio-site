import type { LocaleCode, Localized, MaybeLocalized } from '~~/shared/types/profile'

function isLocalized<T>(value: MaybeLocalized<T>): value is Localized<T> {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && 'ru' in value
    && 'en' in value
  )
}

/**
 * Значение на заданном языке. Нужен там, где язык не зависит от страницы,
 * например в микроразметке: сущности (человек, сайт) описаны по-английски.
 */
export function inLocale<T>(value: MaybeLocalized<T>, code: LocaleCode): T {
  return isLocalized(value) ? value[code] : value
}

/**
 * Достаёт из контента значение на текущем языке.
 * Значения без переводов (имена собственные) возвращаются как есть.
 */
export function useLocalized() {
  const { locale } = useI18n()

  const code = computed<LocaleCode>(() => (locale.value === 'en' ? 'en' : 'ru'))

  function tx<T>(value: MaybeLocalized<T>): T {
    return inLocale(value, code.value)
  }

  return { code, tx }
}
