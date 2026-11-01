<template>
  <FormField
    label="Priority"
    name="priority"
    help="Use the arrow keys or click a level."
    class="w-80"
  >
    <PriorityPicker v-model="priority" />
  </FormField>
</template>

<script setup lang="ts">
import { FormField } from '@hareui/vue'
import { ref } from 'vue'

import PriorityPicker from './components/PriorityPicker.vue'

const priority = ref(1)
</script>
