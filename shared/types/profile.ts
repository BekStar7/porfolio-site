/**
 * Типы контента портфолио.
 * Весь текст хранится сразу на двух языках — см. `Localized`.
 */

export type LocaleCode = 'ru' | 'en'

/** Строка (или любое значение), доступная на каждом языке сайта. */
export type Localized<T = string> = Record<LocaleCode, T>

/**
 * Значение, которое может быть как переводимым, так и одинаковым для всех языков
 * (имена собственные: «SplitCheck Bot», «Vue 3»).
 */
export type MaybeLocalized<T = string> = T | Localized<T>

/** Год и месяц в формате `YYYY-MM`. `null` в поле `end` означает «по настоящее время». */
export type YearMonth = `${number}-${number}`

export interface SocialLink {
  id: string
  /** Ключ иконки в `<AppIcon>` */
  icon: string
  label: string
  /** Человекочитаемый вид ссылки: github.com/BekStar7 */
  handle: string
  href: string
}

export interface Stat {
  id: string
  /** Число уже отформатировано под язык: «1,5 млн» / «1.5M» */
  value: MaybeLocalized
  label: Localized
}

export interface SkillGroup {
  id: string
  title: Localized
  items: string[]
}

export interface Role {
  title: Localized
  start: YearMonth
  end: YearMonth | null
  highlights: Localized<string[]>
}

export interface Job {
  id: string
  company: string
  /** Уточнение в скобках: «EdTech», «Krisha.kz» */
  note?: string
  /** Ссылка для уточнения, если это отдельный продукт: Krisha.kz → krisha.kz */
  noteHref?: string
  href?: string
  /** Квадратный логотип из `public/`: «/logos/zimran.svg». Без него — буква-монограмма */
  logo?: string
  location: Localized
  roles: Role[]
}

export interface Project {
  id: string
  title: MaybeLocalized
  summary: Localized
  description: Localized
  /** Год или диапазон лет для подписи карточки */
  period: string
  tags: string[]
  links: { label: Localized; href: string; primary?: boolean }[]
  /** Ключевой результат — выводится отдельной строкой */
  impact?: Localized
}

/**
 * Места работы до перехода во фронтенд.
 * Выводятся одной строкой без списка задач: они закрывают пробел в хронологии
 * и подтверждают историю смены профессии, но не конкурируют за внимание
 * с основным опытом.
 */
export interface EarlyRole {
  id: string
  company: Localized
  role: Localized
  start: YearMonth
  end: YearMonth
  summary: Localized
}

export interface EducationEntry {
  id: string
  institution: Localized
  degree: Localized
  field: Localized
  start: string
  end: string
}

export interface LanguageSkill {
  id: string
  name: Localized
  level: Localized
  /** 1–5, для визуальной шкалы; дублируется текстом в `level` */
  proficiency: 1 | 2 | 3 | 4 | 5
}

export interface PressItem {
  id: string
  title: Localized
  outlet: string
  date: string
  href: string
  quote?: Localized
}

export interface Profile {
  name: Localized
  role: Localized
  tagline: Localized
  location: Localized
  availability: Localized
  email: string
  socials: SocialLink[]
  stats: Stat[]
  about: Localized<string[]>
  quote: { text: Localized; context: Localized; href: string }
  skills: SkillGroup[]
  experience: Job[]
  earlyCareer: EarlyRole[]
  projects: Project[]
  education: EducationEntry[]
  languages: LanguageSkill[]
  press: PressItem[]
}
