<template>
  <TextField id="handle" class="w-64" :invalid="isInvalid">
    <template #default="{ id }">
      <Label :for="id">Handle</Label>
      <Input v-model="value" class="bg-field font-mono" placeholder="min. 3 characters" />
      <FieldError v-if="isInvalid" :id="`${id}-error`" class="font-medium">
        Handle must be at least 3 characters
      </FieldError>
    </template>
  </TextField>
</template>

<script setup lang="ts">
import { FieldError, Input, Label, TextField } from '@hareui/vue'
import { computed, ref } from 'vue'

const value = ref('jr')
const isInvalid = computed(() => value.value.length > 0 && value.value.length < 3)
</script>
