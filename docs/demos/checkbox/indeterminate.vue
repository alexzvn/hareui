<template>
  <Checkbox
    id="select-all"
    v-model="checked"
    label="Select all"
    description="Shows indeterminate state (dash icon)"
  />
</template>

<script setup lang="ts">
import { Checkbox } from '@hareui/vue'
import { ref } from 'vue'

const checked = ref<boolean | 'indeterminate'>('indeterminate')
</script>
