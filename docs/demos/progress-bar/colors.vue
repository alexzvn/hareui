<template>
  <div class="flex w-64 flex-col gap-6">
    <ProgressBar aria-label="Default" color="default" label="Default" :value="50" />
    <ProgressBar aria-label="Accent" color="accent" label="Accent" :value="50" />
    <ProgressBar aria-label="Success" color="success" label="Success" :value="50" />
    <ProgressBar aria-label="Warning" color="warning" label="Warning" :value="50" />
    <ProgressBar aria-label="Danger" color="danger" label="Danger" :value="50" />
  </div>
</template>

<script setup lang="ts">
import { ProgressBar } from '@hareui/vue'
</script>
