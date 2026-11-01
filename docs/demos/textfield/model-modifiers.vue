<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <TextField
      v-model.trim="email"
      label="Email"
      name="email"
      type="email"
      placeholder="jane@example.com"
      :description="`Value: ${JSON.stringify(email)}`"
    />
    <TextField
      v-model.number.optional="age"
      label="Age"
      name="age"
      inputmode="numeric"
      placeholder="32"
      :description="`Value: ${JSON.stringify(age) ?? 'undefined'}`"
    />
  </div>
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
import { ref } from 'vue'

const email = ref('')
const age = ref<string | number | null>()
</script>
