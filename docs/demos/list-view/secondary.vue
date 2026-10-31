<template>
  <ListView
    :items="items"
    variant="secondary"
    selectable
    multiple
    :default-value="['tue']"
    aria-label="Team stand-ups"
    class="max-w-md"
  />
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  { value: 'mon', label: 'Planning', description: 'Monday, 9:30', icon: icon('calendar') },
  { value: 'tue', label: 'Design review', description: 'Tuesday, 14:00', icon: icon('calendar') },
  { value: 'wed', label: 'Customer call', description: 'Wednesday, 11:00', icon: icon('calendar') },
  { value: 'fri', label: 'Retrospective', description: 'Friday, 16:00', icon: icon('calendar') },
]
</script>
