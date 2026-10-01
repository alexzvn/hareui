<script setup lang="ts">
import { Switch } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Switch label="Label after" />
    <Switch label="Label before" :ui="{ content: 'flex-row-reverse justify-end' }" />
  </div>
</template>
