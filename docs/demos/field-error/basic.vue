<script setup lang="ts">
import { TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('jr')
const invalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>

<template>
  <TextField
    id="username"
    v-model="value"
    class="w-64"
    label="Username"
    placeholder="Enter username"
    :invalid="invalid"
    error-message="Username must be at least 3 characters"
  />
</template>
