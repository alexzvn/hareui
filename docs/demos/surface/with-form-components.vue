<script setup lang="ts">
import { Input, Surface, TextArea } from '@hareui/vue'
</script>

<template>
  <Surface class="flex min-w-[320px] flex-col gap-4 rounded-3xl p-6" variant="default">
    <Input placeholder="Input with secondary variant" variant="secondary" />
    <TextArea placeholder="TextArea with secondary variant" variant="secondary" />
  </Surface>
</template>
