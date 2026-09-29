<template>
  <div class="layout">
    <SkipLink />
    <AppHeader />

    <!-- tabindex="-1" нужен, чтобы ссылка «к содержимому» действительно
         переносила фокус клавиатуры, а не только прокручивала страницу. -->
    <main id="main" tabindex="-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100svh;
}

main {
  flex: 1;
}

main:focus {
  outline: none;
}
</style>
