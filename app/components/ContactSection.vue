<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()

const isCopied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    isCopied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (isCopied.value = false), 2500)
  }
  catch {
    // Буфер обмена может быть недоступен (нет разрешения, небезопасный контекст) —
    // адрес рядом виден и кликабелен, так что действие не единственное.
  }
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
  <section id="contact" class="section" tabindex="-1" aria-labelledby="contact-title">
    <div class="container">
      <div :class="[$style.contact, 'card']">
        <div class="section-head">
          <p class="eyebrow" aria-hidden="true">06</p>
          <h2 id="contact-title">{{ t('sections.contact') }}</h2>
        </div>

        <p class="prose text-lg leading-[1.55] text-muted">{{ t('contact.lead') }}</p>

        <div class="mt-xl flex flex-wrap gap-s">
          <a class="btn btn-primary gap-2" :href="`mailto:${profile.email}`">
            <AppIcon name="mail" :size="18" />
            {{ profile.email }}
          </a>

          <button type="button" class="btn btn-ghost gap-2" @click="copyEmail">
            <AppIcon :name="isCopied ? 'check' : 'copy'" :size="17" />
            {{ isCopied ? t('contact.copied') : t('contact.copy') }}
          </button>
        </div>

        <!-- Результат копирования объявляется вслух: визуально его видно
             по смене подписи кнопки, а role="status" сообщает скринридеру. -->
        <p role="status" aria-live="polite" class="sr-only">
          {{ isCopied ? t('contact.copied') : '' }}
        </p>

        <ul :class="[$style.socials, 'mt-xl grid gap-xs']" :aria-label="t('a11y.socialLinks')">
          <li v-for="social in profile.socials" :key="social.id">
            <AppLink
              class="gap-s rounded-s border border-border px-m py-s text-fg no-underline transition-colors hover:border-accent hover:bg-accent-veil"
              :href="social.href"
              :show-icon="false"
            >
              <AppIcon :name="social.icon as never" :size="19" />
              <span class="grid min-w-0">
                <span class="text-sm font-semibold">{{ social.label }}</span>
                <span class="text-sm wrap-anywhere text-subtle">{{ social.handle }}</span>
              </span>
            </AppLink>
          </li>
        </ul>

        <p class="mt-l flex items-center gap-2 text-sm text-subtle">
          <AppIcon name="pin" :size="16" />
          {{ tx(profile.location) }} · {{ tx(profile.availability) }}
        </p>
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./ContactSection.module.scss"></style>
