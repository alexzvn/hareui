<script setup lang="ts">
import { TextArea, TextField } from 'herouse'
import { ref } from 'vue'

const name = ref('')
const bio = ref('')
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <TextField
      v-model="name"
      label="Display name"
      name="name"
      placeholder="Jane"
      :description="`Characters: ${name.length}`"
    />
    <TextField
      v-model="bio"
      label="Bio"
      name="bio"
      :description="`Characters: ${bio.length} / 200`"
    >
      <TextArea placeholder="Tell us about yourself..." />
    </TextField>
  </div>
</template>
