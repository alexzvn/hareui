<template>
  <div class="flex min-h-screen items-start justify-center p-6 pb-28">
    <ListView
      v-model="selected"
      :items="items"
      selectable
      multiple
      aria-label="Uploads"
      class="max-w-md"
    />
    <ActionBar :open="selected.length > 0" aria-label="Upload actions">
      <template #prefix>
        <Chip size="sm" variant="secondary" class="shrink-0 tabular-nums">
          {{ selected.length }}
        </Chip>
      </template>
      <template #default="{ labelClass }">
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:folder-arrow-right" />
          <span :class="labelClass">Move</span>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:arrow-shape-turn-up-right" />
          <span :class="labelClass">Share</span>
        </Button>
        <Button size="sm" variant="danger-soft" @click="removeSelected">
          <Icon icon="gravity-ui:trash-bin" />
          <span :class="labelClass">Delete</span>
        </Button>
      </template>
      <template #suffix>
        <Button
          icon-only
          size="sm"
          variant="ghost"
          aria-label="Clear selection"
          @click="selected = []"
        >
          <Icon icon="gravity-ui:xmark" />
        </Button>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import type { ListViewItem, ListViewValue } from '@hareui/vue'
import { ActionBar, Button, Chip, ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const items = ref<ListViewItem[]>([
  { value: 'poster', label: 'Festival poster.png', description: '2.4 MB', icon: icon('picture') },
  {
    value: 'contract',
    label: 'Venue contract.pdf',
    description: '820 KB',
    icon: icon('file-text'),
  },
  { value: 'lineup', label: 'Lineup draft.docx', description: '96 KB', icon: icon('file') },
  { value: 'teaser', label: 'Teaser cut.mp4', description: '148 MB', icon: icon('video') },
  { value: 'budget', label: 'Budget.xlsx', description: '64 KB', icon: icon('file') },
])

const selected = ref<ListViewValue[]>([])

const removeSelected = () => {
  items.value = items.value.filter((item) => !selected.value.includes(item.value))
  selected.value = []
}
</script>
