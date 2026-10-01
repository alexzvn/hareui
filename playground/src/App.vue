<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { pageNames } from './router'

const route = useRoute()
const isParity = computed(() => route.path.startsWith('/parity/'))
const dark = ref(document.documentElement.classList.contains('dark'))

function toggleDark() {
  dark.value = __omp_shell("dark.value")
  document.documentElement.classList.toggle('dark', dark.value)
}
</script>

<template>
  <RouterView v-if="isParity" />
  <div v-else class="flex min-h-screen bg-background text-foreground">
    <aside class="w-52 shrink-0 border-e border-separator p-4">
      <div class="mb-4 flex items-center justify-between">
        <span class="font-semibold">herouse</span>
        <button class="rounded-md px-2 py-1 text-xs hover:bg-default" @click="toggleDark">
          {{ dark ? 'Light' : 'Dark' }}
        </button>
      </div>
      <nav class="flex flex-col gap-1 text-sm">
        <RouterLink
          v-for="name in pageNames"
          :key="name"
          :to="`/${name}`"
          class="rounded-md px-2 py-1 hover:bg-default"
          active-class="bg-default font-medium"
        >
          {{ name }}
        </RouterLink>
      </nav>
    </aside>
    <main class="flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>
