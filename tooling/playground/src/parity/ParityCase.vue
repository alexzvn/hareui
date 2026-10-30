<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { cases } from './cases'

const route = useRoute()
const render = computed(() => cases[route.params.id as string])

if (new URLSearchParams(location.search).get('theme') === 'dark')
  document.documentElement.classList.add('dark')
</script>

<template>
  <div v-if="render" id="case" class="inline-block p-8">
    <component :is="render" />
  </div>
  <p v-else id="case-missing">
    Missing case {{ route.params.id }}
  </p>
</template>
