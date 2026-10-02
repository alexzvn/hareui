<script setup lang="ts">
import { DateField } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField required class="w-[256px]" name="date" label="Date" />
    <DateField required class="w-[256px]" name="start-date" label="Start date" description="Required field" />
  </div>
</template>
