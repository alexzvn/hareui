<script setup lang="ts">
import { Header } from '@hareui/vue'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="overflow-hidden rounded-xl border border-separator">
      <Header title="Docs home" to="#docs" />
    </div>

    <!-- The `left` slot replaces the title link, e.g. to render a router link. -->
    <div class="overflow-hidden rounded-xl border border-separator">
      <Header>
        <template #left>
          <a aria-label="Home" class="rounded-lg text-foreground outline-none focus-visible:status-focused" href="#docs">
            <span class="flex items-center gap-2">
              <svg aria-hidden="true" fill="currentColor" height="22" viewBox="0 0 32 32" width="22">
                <path d="M14.125 5.5C14.125 1.99 15.115 1 18.625 1L25.875 1C29.385 1 30.375 1.99 30.375 5.5L30.375 12.75C30.375 16.26 29.385 17.25 25.875 17.25L22.875 17.25C18.975 17.25 17.875 18.35 17.875 22.25L17.875 26.5C17.875 30.01 16.885 31 13.375 31L6.125 31C2.615 31 1.625 30.01 1.625 26.5L1.625 19.25C1.625 15.74 2.615 14.75 6.125 14.75L9.125 14.75C13.025 14.75 14.125 13.65 14.125 9.75Z" transform="rotate(-1.5 16 16)" />
              </svg>
              <span class="text-lg font-semibold">HareUI</span>
            </span>
          </a>
        </template>
      </Header>
    </div>
  </div>
</template>
