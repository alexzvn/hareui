<template>
  <RadioButtonGroup
    class="w-[min(400px,calc(100vw-2rem))] gap-2"
    default-value="backend"
    name="learning-track"
    label="Pick a learning track"
  >
    <RadioButtonGroupItem
      v-for="track in tracks"
      :key="track.value"
      class="py-3 pe-12"
      :value="track.value"
      :description="`${track.weeks} weeks · ${track.summary}`"
      :ui="{
        indicator: 'top-1/2 -translate-y-1/2',
        content: 'gap-3',
        icon: 'flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground [:where(&_svg)]:size-4',
      }"
    >
      <template #indicator>
        <Icon icon="gravity-ui:circle-check" />
      </template>
      <template #icon>
        <Icon :icon="track.icon" />
      </template>
      <template #label>
        <span class="flex items-center gap-2 font-semibold">
          {{ track.title }}
          <Chip v-if="track.isNew" color="accent" size="sm" label="New" />
        </span>
      </template>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>

<script setup lang="ts">
import { Chip, RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const tracks = [
  {
    value: 'frontend',
    title: 'Frontend',
    icon: 'gravity-ui:code',
    weeks: 10,
    summary: 'HTML, CSS and component-driven UIs.',
  },
  {
    value: 'backend',
    title: 'Backend',
    icon: 'gravity-ui:server',
    weeks: 12,
    summary: 'APIs, queues and service design.',
  },
  {
    value: 'data',
    title: 'Data',
    icon: 'gravity-ui:database',
    weeks: 14,
    summary: 'SQL, pipelines and dashboards.',
  },
  {
    value: 'design',
    title: 'Product design',
    icon: 'gravity-ui:palette',
    weeks: 8,
    summary: 'Research, wireframes and prototyping.',
    isNew: true,
  },
]
</script>
