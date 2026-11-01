<template>
  <div class="flex flex-wrap gap-6">
    <Link to="#link-props">Release notes</Link>
    <Link href="https://vuejs.org" target="_blank" icon>Vue docs</Link>
    <Link href="/logo.svg" download="hareui-logo.svg">Download logo</Link>
    <Link href="#link-props" disabled>Retired page</Link>
  </div>
</template>

<script setup lang="ts">
import { Link } from '@hareui/vue'
</script>
