<template>
  <div class="w-full max-w-md">
    <ListView
      v-model="selected"
      :items="items"
      selectable
      multiple
      selection-behavior="replace"
      aria-label="Photos"
      @action="(value) => (opened = String(value))"
    />
    <p class="mt-3 text-sm text-muted">
      Selected: {{ selected.join(', ') || 'none' }} · Opened: {{ opened ?? 'nothing yet' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ListViewItem, ListViewValue } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items: ListViewItem[] = [
  { value: 'harbour.jpg', label: 'harbour.jpg', description: '4.2 MB', icon: icon('picture') },
  { value: 'market.jpg', label: 'market.jpg', description: '3.8 MB', icon: icon('picture') },
  { value: 'sunset.jpg', label: 'sunset.jpg', description: '5.1 MB', icon: icon('picture') },
  { value: 'trail.jpg', label: 'trail.jpg', description: '2.9 MB', icon: icon('picture') },
]

const selected = ref<ListViewValue[]>([])
const opened = ref<string>()
</script>
