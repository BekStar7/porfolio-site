<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="skills" class="section" tabindex="-1" aria-labelledby="skills-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow" aria-hidden="true">04</p>
        <h2 id="skills-title">{{ t('sections.skills') }}</h2>
      </div>

      <div :class="[$style.groups, 'grid gap-m']">
        <!-- Каждая группа — заголовок третьего уровня со своим списком:
             скринридер объявляет и название группы, и число навыков в ней. -->
        <section v-for="group in profile.skills" :key="group.id" class="card grid content-start gap-m p-l">
          <h3 class="text-base font-strong">{{ tx(group.title) }}</h3>
          <ul class="tag-list">
            <li v-for="item in group.items" :key="item" class="tag">{{ item }}</li>
          </ul>
        </section>
      </div>
    </div>
  </section>
</template>

<style module lang="scss" src="./SkillsSection.module.scss"></style>
