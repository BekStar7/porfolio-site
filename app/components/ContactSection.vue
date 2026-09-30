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
      <div class="contact card">
        <div class="section-head">
          <p class="eyebrow" aria-hidden="true">06</p>
          <h2 id="contact-title">{{ t('sections.contact') }}</h2>
        </div>

        <p class="contact__lead prose">{{ t('contact.lead') }}</p>

        <div class="contact__actions">
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

        <ul class="contact__socials" :aria-label="t('a11y.socialLinks')">
          <li v-for="social in profile.socials" :key="social.id">
            <AppLink class="contact__social" :href="social.href" :show-icon="false">
              <AppIcon :name="social.icon as never" :size="19" />
              <span class="contact__social-label">
                <span class="contact__social-name">{{ social.label }}</span>
                <span class="contact__social-handle">{{ social.handle }}</span>
              </span>
            </AppLink>
          </li>
        </ul>

        <p class="contact__where">
          <AppIcon name="pin" :size="16" />
          {{ tx(profile.location) }} · {{ tx(profile.availability) }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: clamp(1.5rem, 1rem + 3vw, 3rem);
  background:
    radial-gradient(90% 120% at 100% 0%, var(--accent-veil), transparent 60%),
    var(--surface);
}

.contact__lead {
  color: var(--text-muted);
  font-size: var(--step-1);
  line-height: 1.55;
}

.contact__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  margin-block-start: var(--space-xl);
}

.contact__actions .btn {
  text-decoration: none;
}

.contact__socials {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: var(--space-xs);
  margin-block-start: var(--space-xl);
  padding: 0;
  list-style: none;
}

.contact__social {
  gap: var(--space-s);
  padding: var(--space-s) var(--space-m);
  border: 1px solid var(--border);
  border-radius: var(--radius-s);
  color: var(--text);
  text-decoration: none;
  transition: border-color var(--transition), background-color var(--transition);
}

.contact__social:hover {
  border-color: var(--accent);
  background: var(--accent-veil);
  color: var(--text);
}

.contact__social-label {
  display: grid;
  min-width: 0;
}

.contact__social-name {
  font-size: var(--step--1);
  font-weight: 600;
}

.contact__social-handle {
  color: var(--text-subtle);
  font-size: var(--step--1);
  overflow-wrap: anywhere;
}

.contact__where {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-block-start: var(--space-l);
  color: var(--text-subtle);
  font-size: var(--step--1);
}
</style>
