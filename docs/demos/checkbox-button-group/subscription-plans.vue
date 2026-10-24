<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const courses = [
  { value: 'vocabulary', label: 'Vocabulary', description: 'New words with spaced repetition.', lessons: 2 },
  { value: 'speaking', label: 'Speaking', description: 'Voice drills with pronunciation feedback.', lessons: 3 },
  { value: 'grammar', label: 'Grammar', description: 'Short lessons on the tricky rules.', lessons: 1 },
]
</script>

<template>
  <CheckboxButtonGroup
    class="w-[360px]"
    name="courses"
    label="Courses"
    description="Pick the tracks to include."
    :default-value="['vocabulary', 'speaking']"
  >
    <CheckboxButtonGroupItem
      v-for="course in courses"
      :key="course.value"
      :value="course.value"
      :label="course.label"
      :description="course.description"
    >
      <span class="mt-2 text-xs font-medium text-accent">
        {{ course.lessons }} {{ course.lessons === 1 ? 'lesson' : 'lessons' }} per week
      </span>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>
