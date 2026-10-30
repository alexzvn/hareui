<template>
  <div class="flex w-72 flex-col gap-3">
    <div class="flex gap-2">
      <Button size="sm" variant="secondary" @click="addTask">Add task</Button>
      <Button size="sm" variant="secondary" :disabled="!selected?.parent" @click="removeTask"
        >Remove</Button
      >
    </div>
    <Tree v-model="selected" :items="items" :get-key="(item) => item.id as string" />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Button, Tree } from '@hareui/vue'
import { ref } from 'vue'

let nextId = 4

const items = ref<TreeItem[]>([
  {
    id: 'sprint',
    label: 'Sprint 14',
    defaultExpanded: true,
    children: [
      { id: '1', label: 'Fix login timeout', parent: 'sprint' },
      { id: '2', label: 'Update onboarding copy', parent: 'sprint' },
      { id: '3', label: 'Profile photo upload', parent: 'sprint' },
    ],
  },
])

const selected = ref<TreeItem>()

const addTask = () => {
  const sprint = items.value[0]!
  sprint.children = [
    ...sprint.children!,
    { id: String(nextId), label: `New task ${nextId}`, parent: 'sprint' },
  ]

  nextId += 1
}

const removeTask = () => {
  const sprint = items.value[0]!
  sprint.children = sprint.children!.filter((task) => task.id !== selected.value?.id)
  selected.value = undefined
}
</script>
