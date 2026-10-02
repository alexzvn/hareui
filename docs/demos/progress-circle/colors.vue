<script setup lang="ts">
import { ProgressCircle } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-6">
    <ProgressCircle aria-label="Default" color="default" :value="60" />
    <ProgressCircle aria-label="Accent" color="accent" :value="60" />
    <ProgressCircle aria-label="Success" color="success" :value="60" />
    <ProgressCircle aria-label="Warning" color="warning" :value="60" />
    <ProgressCircle aria-label="Danger" color="danger" :value="60" />
  </div>
</template>
