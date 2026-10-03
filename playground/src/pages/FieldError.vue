<script setup lang="ts">
import { FieldError, TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('jr')
const invalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">FieldError</h1>
    <FieldError>Standalone error message</FieldError>
    <TextField
      v-model="value"
      class="w-64"
      label="Username"
      placeholder="Enter username"
      :invalid="invalid"
      error-message="Username must be at least 3 characters"
    />
    <FieldError :ui="{ base: 'font-medium' }">:ui override</FieldError>
  </div>
</template>
