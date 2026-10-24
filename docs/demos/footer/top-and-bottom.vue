<template>
  <div class="w-full overflow-hidden rounded-xl border border-separator">
    <Footer class="border-t-0">
      <!-- `top` and `bottom` are full-width areas rendered only when filled. -->
      <template #top>
        <Container class="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-8">
          <div class="col-span-3 flex flex-col gap-2 text-foreground sm:col-span-1">
            <span class="flex items-center gap-2">
              <svg
                aria-hidden="true"
                fill="currentColor"
                focusable="false"
                height="22"
                viewBox="0 0 32 32"
                width="22"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.125 5.5C14.125 1.99 15.115 1 18.625 1L25.875 1C29.385 1 30.375 1.99 30.375 5.5L30.375 12.75C30.375 16.26 29.385 17.25 25.875 17.25L22.875 17.25C18.975 17.25 17.875 18.35 17.875 22.25L17.875 26.5C17.875 30.01 16.885 31 13.375 31L6.125 31C2.615 31 1.625 30.01 1.625 26.5L1.625 19.25C1.625 15.74 2.615 14.75 6.125 14.75L9.125 14.75C13.025 14.75 14.125 13.65 14.125 9.75Z"
                  transform="rotate(-1.5 16 16)"
                />
              </svg>
              <span class="text-lg font-semibold">HareUI</span>
            </span>
            <p class="text-sm text-muted">Accessible, themeable Vue components.</p>
          </div>
          <div v-for="column in columns" :key="column.label" class="flex flex-col gap-2">
            <p class="text-sm font-medium text-foreground">
              {{ column.label }}
            </p>
            <a
              v-for="link in column.links"
              :key="link"
              class="w-fit rounded-sm text-sm text-muted no-underline outline-none hover:text-foreground focus-visible:status-focused"
              href="#"
            >
              {{ link }}
            </a>
          </div>
        </Container>
      </template>

      <template #left>
        <p class="text-sm text-muted">Copyright © {{ new Date().getFullYear() }} HareUI</p>
      </template>

      <template #right>
        <a
          class="rounded-sm text-sm text-muted no-underline outline-none hover:text-foreground focus-visible:status-focused"
          href="#"
          >Privacy</a
        >
        <a
          class="rounded-sm text-sm text-muted no-underline outline-none hover:text-foreground focus-visible:status-focused"
          href="#"
          >Terms</a
        >
      </template>
    </Footer>
  </div>
</template>

<script setup lang="ts">
import { Container, Footer } from '@hareui/vue'

const columns = [
  { label: 'Product', links: ['Components', 'Themes', 'Releases'] },
  { label: 'Resources', links: ['Docs', 'Figma Kit', 'Playground'] },
  { label: 'Community', links: ['GitHub', 'Discussions', 'Contributing'] },
]
</script>
