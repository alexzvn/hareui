<script setup lang="ts">
import { Main } from '@hareui/vue'
</script>

<template>
  <div class="w-full overflow-hidden rounded-2xl border border-border bg-surface [--header-height:3.5rem]">
    <header class="flex h-(--header-height) items-center justify-between border-b border-separator px-6">
      <span class="text-sm font-semibold text-foreground">Acme</span>
      <nav class="flex items-center gap-5 text-sm text-muted">
        <span>Docs</span>
        <span>Blog</span>
      </nav>
    </header>
    <!-- In a page, Main fills `100vh - var(--header-height)`; `min-h-64` keeps this preview compact. -->
    <Main class="flex min-h-64 flex-col gap-1.5 bg-surface-secondary p-6">
      <h2 class="text-lg font-semibold text-foreground">Page title</h2>
      <p class="text-sm text-muted">Main fills the viewport below the header, even when the page is short.</p>
    </Main>
  </div>
</template>
