<script setup lang="ts">
import { TextArea, TextField } from 'herouse'
import { computed, ref } from 'vue'

const username = ref('')
const bio = ref('')
const usernameInvalid = computed(() => username.value.length > 0 && username.value.length < 3)
const bioInvalid = computed(() => bio.value.length > 0 && bio.value.length < 20)
</script>

<template>
  <div class="flex w-full max-w-64 flex-col gap-4">
    <TextField
      v-model="username"
      required
      :invalid="usernameInvalid"
      label="Username"
      name="username"
      placeholder="jane_doe"
      :description="usernameInvalid ? undefined : 'Choose a unique username for your profile.'"
      error-message="Username must be at least 3 characters."
    />
    <TextField
      v-model="bio"
      required
      :invalid="bioInvalid"
      label="Bio"
      name="bio"
      :description="bioInvalid ? undefined : `Minimum 20 characters (${bio.length}/20).`"
      error-message="Bio must contain at least 20 characters."
    >
      <TextArea placeholder="Tell us about yourself..." />
    </TextField>
  </div>
</template>
