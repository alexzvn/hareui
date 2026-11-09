<script setup lang="ts">
import { cases } from './cases'

// Read from the URL, not the router: the parity build (parity.html) mounts this component without one.
const id = decodeURIComponent(location.pathname.replace(/^\/parity\//, ''))
const render = cases[id]

if (new URLSearchParams(location.search).get('theme') === 'dark')
  document.documentElement.classList.add('dark')
</script>

<template>
  <div v-if="render" id="case" class="inline-block p-8">
    <component :is="render" />
  </div>
  <p v-else id="case-missing">
    Missing case {{ id }}
  </p>
</template>
