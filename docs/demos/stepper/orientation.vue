<template>
  <Stepper :items="items" orientation="vertical" :default-value="1" />
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Application', description: 'Tell us about yourself' },
  { title: 'Documents', description: 'Upload your ID and payslips' },
  { title: 'Interview', description: 'A short video call' },
  { title: 'Decision', description: 'Within five working days' },
]
</script>
