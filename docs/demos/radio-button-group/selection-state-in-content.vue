<template>
  <RadioButtonGroup
    class="w-[min(360px,calc(100vw-2rem))]"
    default-value="moderate"
    name="intensity"
    variant="secondary"
    label="Workout intensity"
  >
    <RadioButtonGroupItem
      v-for="option in intensities"
      :key="option.value"
      :value="option.value"
      :label="option.title"
      :description="option.description"
      #default="{ selected }"
    >
      <span class="mt-2 text-sm font-semibold" :class="{ 'text-accent': selected }">
        {{ option.minutes }} min<span class="text-xs font-normal text-muted"> per day</span>
      </span>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>

<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'

const intensities = [
  { value: 'easy', title: 'Easy', description: 'Walks and light stretching', minutes: 20 },
  {
    value: 'moderate',
    title: 'Moderate',
    description: 'Jogging, cycling, yoga flows',
    minutes: 35,
  },
  {
    value: 'intense',
    title: 'Intense',
    description: 'Intervals and strength circuits',
    minutes: 45,
  },
]
</script>
