<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="skills" class="section" tabindex="-1" aria-labelledby="skills-title">
    <div class="container">
      <div class="section__head">
        <p class="section__eyebrow" aria-hidden="true">04</p>
        <h2 id="skills-title">{{ t('sections.skills') }}</h2>
      </div>

      <div class="skills">
        <!-- Каждая группа — заголовок третьего уровня со своим списком:
             скринридер объявляет и название группы, и число навыков в ней. -->
        <section v-for="group in profile.skills" :key="group.id" class="skills__group card">
          <h3 class="skills__title">{{ tx(group.title) }}</h3>
          <ul class="tag-list">
            <li v-for="item in group.items" :key="item" class="tag">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  display: grid;
  gap: var(--space-m);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
}

.skills__group {
  display: grid;
  gap: var(--space-m);
  align-content: start;
  padding: var(--space-l);
}

.skills__title {
  font-size: var(--step-0);
  font-weight: 650;
  color: var(--text);
}
</style>
