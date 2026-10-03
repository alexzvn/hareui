<script setup lang="ts">
import { Kbd } from '@hareui/vue'
</script>

<template>
  <div class="space-y-3">
    <div class="rounded-lg bg-surface p-4">
      <h4 class="mb-2 text-sm font-semibold">
        Quick Actions
      </h4>
      <ul class="space-y-2 text-sm">
        <li>• Open search: <Kbd keys="command">K</Kbd></li>
        <li>• Toggle sidebar: <Kbd keys="command">B</Kbd></li>
        <li>• New file: <Kbd keys="command">N</Kbd></li>
        <li>• Quick save: <Kbd keys="command">S</Kbd></li>
      </ul>
    </div>
  </div>
</template>
