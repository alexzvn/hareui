<template>
  <div class="flex w-[280px] flex-col gap-2">
    <TextArea full-width placeholder="Primary textarea" variant="primary" />
    <TextArea full-width placeholder="Secondary textarea" variant="secondary" />
  </div>
</template>

<script setup lang="ts">
import { TextArea } from '@hareui/vue'
</script>
