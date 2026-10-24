<template>
  <CheckboxButtonGroup
    class="w-[440px] grid-cols-2"
    layout="grid"
    name="routines"
    label="Home routines"
    :default-value="['morning', 'night']"
  >
    <CheckboxButtonGroupItem
      v-for="routine in routines"
      :key="routine.value"
      :value="routine.value"
      :description="routine.description"
      :ui="{ itemLabel: 'flex flex-col items-start gap-3' }"
    >
      <template #label>
        <span
          class="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent"
        >
          <Icon :icon="routine.icon" class="size-5" />
        </span>
        <span class="flex items-center gap-2">
          {{ routine.label }}
          <span
            v-if="routine.isNew"
            class="rounded-full border border-accent px-1.5 text-[11px] leading-4 text-accent"
            >New</span
          >
        </span>
      </template>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>

<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const routines = [
  {
    value: 'morning',
    label: 'Good morning',
    description: 'Blinds up and coffee on at 7:00.',
    icon: 'gravity-ui:sun',
  },
  {
    value: 'away',
    label: 'Away mode',
    description: 'Lock up and switch off lights.',
    icon: 'gravity-ui:lock',
  },
  {
    value: 'night',
    label: 'Night',
    description: 'Dim the hallway after 23:00.',
    icon: 'gravity-ui:moon',
    isNew: true,
  },
  {
    value: 'power',
    label: 'Power saver',
    description: 'Cut idle plugs at peak hours.',
    icon: 'gravity-ui:power',
  },
]
</script>
