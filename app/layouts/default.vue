<template>
  <div class="flex min-h-svh flex-col">
    <SkipLink />
    <AppHeader />

    <!-- tabindex="-1" нужен, чтобы ссылка «к содержимому» действительно
         переносила фокус клавиатуры, а не только прокручивала страницу. -->
    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
