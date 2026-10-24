<template>
  <TextField
    id="username"
    v-model="value"
    class="w-64"
    label="Username"
    placeholder="Enter username"
    :invalid="isInvalid"
    error-message="Username must be at least 3 characters"
  />
</template>

<script setup lang="ts">
import { TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('jr')
const isInvalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>
