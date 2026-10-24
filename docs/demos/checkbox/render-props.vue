<template>
  <Checkbox id="render-props-terms">
    <template #label="{ state }">
      {{ state === 'checked' ? 'Terms accepted' : 'Accept terms' }}
    </template>
    <template #description="{ state }">
      {{ state === 'checked' ? 'Thank you for accepting' : 'Please read and accept the terms' }}
    </template>
  </Checkbox>
</template>

<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
</script>
