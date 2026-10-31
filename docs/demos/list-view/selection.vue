<template>
  <div class="grid w-full gap-6 sm:grid-cols-3">
    <div class="flex min-w-0 flex-col gap-2">
      <span class="text-sm font-medium">Not selectable</span>
      <ListView :items="items" aria-label="Playlists" />
    </div>
    <div class="flex min-w-0 flex-col gap-2">
      <span class="text-sm font-medium">selectable</span>
      <ListView v-model="favourite" :items="items" selectable aria-label="Favourite playlist" />
    </div>
    <div class="flex min-w-0 flex-col gap-2">
      <span class="text-sm font-medium">selectable multiple</span>
      <ListView
        v-model="offline"
        :items="items"
        selectable
        multiple
        aria-label="Offline playlists"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListViewItem, ListViewValue } from '@hareui/vue'
import { ListView } from '@hareui/vue'
import { ref } from 'vue'

const items: ListViewItem[] = [
  { value: 'focus', label: 'Deep focus', description: '42 tracks' },
  { value: 'commute', label: 'Morning commute', description: '18 tracks' },
  { value: 'cooking', label: 'Sunday cooking', description: '25 tracks' },
  { value: 'run', label: 'Long run', description: '31 tracks' },
]

const favourite = ref<ListViewValue | null>('commute')
const offline = ref<ListViewValue[]>(['focus', 'run'])
</script>
