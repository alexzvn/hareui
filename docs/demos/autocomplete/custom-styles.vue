<template>
  <div class="w-full max-w-sm pt-6">
    <!-- HeroUI places the Description between the Label and the trigger; here both sit above the component -->
    <div class="flex w-full flex-col gap-1.5">
      <Label id="assignees-label" class="font-medium text-foreground"> Assignees </Label>
      <Description id="assignees-description">
        People who will be notified when this task updates.
      </Description>
      <Autocomplete
        v-model="selectedKeys"
        clearable
        class="w-full"
        aria-labelledby="assignees-label"
        placeholder="Search teammates..."
        selection-mode="multiple"
        search-label="Search by name or role"
        search-placeholder="Search by name or role..."
        :items="items"
        :ui="{
          trigger:
            'rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-accent/5 transition-[box-shadow,border-color] focus-within:border-accent/25 focus-within:ring-2 focus-within:ring-accent/15 dark:border-border/90 dark:bg-surface dark:ring-accent/10 dark:focus-within:border-accent/35',
          popover:
            'overflow-hidden rounded-xl border border-border/80 bg-surface shadow-xl ring-1 ring-black/3 dark:border-border/90 dark:bg-surface dark:ring-white/5',
          searchGroup: 'border-b border-separator bg-surface-secondary/50',
          searchIcon: 'text-muted',
          listBox: 'p-1.5',
        }"
      >
        <template #value="{ selectedItems, isPlaceholder, text }">
          <template v-if="isPlaceholder">
            {{ text }}
          </template>
          <TagGroup
            v-else
            size="sm"
            removable
            aria-label="Assignees"
            :items="selectedItems.map((item) => ({ id: String(item.value), label: item.label }))"
            :ui="{
              tag: 'border border-accent/15 bg-accent/8 text-foreground dark:border-accent/25 dark:bg-accent/12',
            }"
            @remove="onRemoveTags"
          />
        </template>
        <template #item-label="{ item }">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-medium text-foreground">{{ item.name }}</span>
            <span class="text-xs text-muted">{{ item.role }}</span>
          </div>
        </template>
        <template #empty> No teammates found </template>
      </Autocomplete>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete, Description, Label, TagGroup } from '@hareui/vue'
import { ref } from 'vue'

const TEAMMATES = [
  { id: 'sarah', name: 'Sarah Chen', role: 'Product Design' },
  { id: 'marcus', name: 'Marcus Lee', role: 'Engineering' },
  { id: 'priya', name: 'Priya Patel', role: 'Data Science' },
  { id: 'jordan', name: 'Jordan Kim', role: 'Customer Success' },
  { id: 'alex', name: 'Alex Rivera', role: 'Marketing' },
] as const
const itemClass =
  'rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:bg-accent/5 dark:data-[focused=true]:bg-accent/15 dark:data-[selected=true]:bg-accent/8'

interface Teammate extends ListBoxItem {
  name: string
  role: string
}

const items: Teammate[] = TEAMMATES.map((t) => ({
  value: t.id,
  label: t.name,
  textValue: `${t.name} ${t.role}`,
  class: itemClass,
  name: t.name,
  role: t.role,
}))

const selectedKeys = ref<string[]>([])

function onRemoveTags(ids: string[]) {
  selectedKeys.value = selectedKeys.value.filter((key) => !ids.includes(key))
}
</script>
