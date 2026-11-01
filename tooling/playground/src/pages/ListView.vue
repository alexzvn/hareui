<script setup lang="ts">
import type { ListViewItem, ListViewValue } from '@hareui/vue'
import { Button, ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const files: ListViewItem[] = [
  { value: 'brand', label: 'Brand assets', description: 'Edited 3 hours ago', icon: icon('folder') },
  { value: 'report', label: 'Quarterly report.pdf', description: 'Edited yesterday', icon: icon('file-text') },
  { value: 'archive', label: 'Archive 2024.zip', description: 'Read-only', icon: icon('file-zipper'), disabled: true },
  { value: 'budget', label: 'Budget 2027.xlsx', description: 'Edited last week', icon: icon('file') },
  { value: 'launch', label: 'Launch plan.md', icon: icon('file-text') },
]

const links: ListViewItem[] = [
  { value: 'tree', label: 'Tree page', description: 'Opens /Tree', to: '/Tree', icon: icon('folder-tree') },
  { value: 'heroui', label: 'HeroUI', description: 'Opens in a new tab', href: 'https://heroui.com', target: '_blank', icon: icon('globe') },
]

const large: ListViewItem[] = Array.from({ length: 3000 }, (_, index) => ({
  value: index,
  label: `Row ${index + 1}`,
  description: index % 3 ? undefined : 'With a description',
  disabled: index % 17 === 5,
}))

const multiple = ref<ListViewValue[]>(['report'])
const single = ref<ListViewValue | null>(null)
const replaced = ref<ListViewValue[]>([])
const lastAction = ref<string>('none')
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">ListView</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">variants × selection modes</h2>
      <div class="grid gap-6 lg:grid-cols-3">
        <template v-for="variant in ['primary', 'secondary'] as const" :key="variant">
          <div v-for="mode in ['none', 'single', 'multiple'] as const" :key="`${variant}-${mode}`" class="flex flex-col gap-1">
            <p class="text-xs text-muted">{{ variant }} · {{ mode }}</p>
            <ListView :items="files" :variant="variant" :selectable="mode !== 'none'" :multiple="mode === 'multiple'" :default-value="mode === 'multiple' ? ['brand'] : null" :aria-label="`${variant} ${mode}`" />
          </div>
        </template>
      </div>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">v-model (multiple) + action listener</h2>
      <ListView v-model="multiple" :items="files" selectable multiple aria-label="Files" @action="(value) => (lastAction = String(value))" />
      <p class="mt-2 text-xs text-muted">Selected: {{ multiple.join(', ') || 'none' }} · Action: {{ lastAction }}</p>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">v-model (single)</h2>
      <ListView v-model="single" :items="files" selectable aria-label="Files, single" />
      <p class="mt-2 text-xs text-muted">Selected: {{ single ?? 'null' }}</p>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">selection-behavior="replace" (double click / Enter runs action)</h2>
      <ListView v-model="replaced" :items="files" selectable multiple selection-behavior="replace" aria-label="Files, replace" @action="(value) => (lastAction = String(value))" />
      <p class="mt-2 text-xs text-muted">Selected: {{ replaced.join(', ') || 'none' }} · Action: {{ lastAction }}</p>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">#item-action (ArrowRight / ArrowLeft) and #item-label</h2>
      <ListView :items="files" aria-label="Files with actions">
        <template #item-label="{ item }">
          <span class="font-semibold">{{ item.label }}</span>
        </template>
        <template #item-action="{ item }">
          <div class="flex gap-1">
            <Button icon-only size="sm" variant="ghost" :aria-label="`Share ${item.label}`">
              <Icon icon="gravity-ui:arrow-shape-turn-up-right" />
            </Button>
            <Button icon-only size="sm" variant="ghost" :aria-label="`More for ${item.label}`">
              <Icon icon="gravity-ui:ellipsis" />
            </Button>
          </div>
        </template>
      </ListView>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">links (to / href)</h2>
      <ListView :items="links" aria-label="Links" />
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">empty (default text, then #empty)</h2>
      <div class="flex flex-col gap-4">
        <ListView :items="[]" aria-label="Empty" />
        <ListView :items="[]" variant="secondary" aria-label="Empty with slot">
          <template #empty>Nothing here yet</template>
        </ListView>
      </div>
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <ListView :items="files" selectable multiple aria-label="Custom" :ui="{ base: 'bg-accent-soft', item: 'py-2', label: 'text-accent-soft-foreground' }" />
    </section>

    <section class="max-w-md">
      <h2 class="mb-2 text-sm font-medium text-muted">virtualize (3,000 rows, every 17th disabled)</h2>
      <ListView :items="large" selectable multiple virtualize aria-label="Large list" class="h-96" />
    </section>
  </div>
</template>
