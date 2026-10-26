<template>
  <div class="flex w-64 flex-col gap-6">
    <Meter color="default" label="Default" :value="50" />
    <Meter color="accent" label="Accent" :value="50" />
    <Meter color="success" label="Success" :value="50" />
    <Meter color="warning" label="Warning" :value="50" />
    <Meter color="danger" label="Danger" :value="50" />
  </div>
</template>

<script setup lang="ts">
import { Meter } from '@hareui/vue'
</script>
