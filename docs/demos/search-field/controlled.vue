<script setup lang="ts">
import { Button, SearchField } from 'herouse'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div class="flex flex-col gap-4">
    <SearchField v-model="value" class="w-[280px]" name="search" label="Search">
      <template #description>
        Current value: {{ value || '(empty)' }}
      </template>
    </SearchField>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = ''">
        Clear
      </Button>
      <Button variant="tertiary" @click="value = 'example query'">
        Set example
      </Button>
    </div>
  </div>
</template>
