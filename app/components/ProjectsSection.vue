<script setup lang="ts">
import { profile } from '~/data/profile'

const { t } = useI18n()
const { tx } = useLocalized()
</script>

<template>
  <section id="projects" class="section" tabindex="-1" aria-labelledby="projects-title">
    <div class="container">
      <div class="section__head">
        <p class="section__eyebrow" aria-hidden="true">03</p>
        <h2 id="projects-title">{{ t('sections.projects') }}</h2>
      </div>

      <ul class="projects">
        <li v-for="(project, index) in profile.projects" :key="project.id">
          <article class="project card" :class="{ 'project--featured': index === 0 }">
            <div class="project__head">
              <h3 class="project__title">{{ tx(project.title) }}</h3>
              <p class="project__period">{{ project.period }}</p>
            </div>

            <p class="project__summary">{{ tx(project.summary) }}</p>
            <p class="project__description">{{ tx(project.description) }}</p>

            <p v-if="project.impact" class="project__impact">
              <!-- Подпись читается скринридером, визуально её заменяет акцентная рамка -->
              <span class="sr-only">{{ t('projects.impact') }}: </span>
              {{ tx(project.impact) }}
            </p>

            <ul class="tag-list project__tags" :aria-label="t('projects.stack')">
              <li v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</li>
            </ul>

            <div v-if="project.links.length" class="project__links">
              <AppLink
                v-for="link in project.links"
                :key="link.href"
                class="btn"
                :class="link.primary ? 'btn--primary' : 'btn--ghost'"
                :href="link.href"
              >
                {{ tx(link.label) }}
              </AppLink>
            </div>
            <p v-else class="project__note">{{ t('projects.noLinks') }}</p>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.projects {
  display: grid;
  gap: var(--space-m);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

.project {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
  height: 100%;
  padding: var(--space-l);
  transition: border-color var(--transition), transform var(--transition);
}

.project:hover {
  border-color: var(--border-strong);
}

@media (min-width: 56rem) {
  .projects > li:first-child {
    grid-column: 1 / -1;
  }

  .project--featured {
    border-color: var(--border-strong);
    background: linear-gradient(180deg, var(--accent-veil), transparent 45%), var(--surface);
  }

  .project--featured .project__title {
    font-size: var(--step-2);
  }
}

.project__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
}

.project__title {
  font-size: var(--step-1);
}

.project__period {
  color: var(--text-subtle);
  font-size: var(--step--1);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.project__summary {
  color: var(--text);
  font-weight: 550;
  line-height: 1.5;
}

.project__description {
  max-width: var(--measure);
  color: var(--text-muted);
  font-size: var(--step--1);
  line-height: 1.65;
}

.project__impact {
  max-width: var(--measure);
  padding-inline-start: var(--space-m);
  border-inline-start: 2px solid var(--accent);
  color: var(--text-muted);
  font-size: var(--step--1);
  line-height: 1.55;
}

.project__tags {
  margin-block-start: auto;
  padding-block-start: var(--space-xs);
}

.project__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  padding-block-start: var(--space-2xs);
}

.project__links .btn {
  font-size: var(--step--1);
  text-decoration: none;
}

.project__note {
  padding-block-start: var(--space-2xs);
  color: var(--text-subtle);
  font-size: var(--step--1);
}
</style>
