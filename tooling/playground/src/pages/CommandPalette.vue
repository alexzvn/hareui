<template>
  <div class="flex flex-col gap-8 p-8">
    <section v-for="size in sizes" :key="size" class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">size="{{ size }}"</h2>
      <CommandPalette
        :size="size"
        :groups="groups"
        :autofocus="false"
        class="h-80 rounded-2xl bg-surface shadow-surface"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">States: loading, close, multiple, highlight matches</h2>
      <CommandPalette
        v-model="selected"
        v-model:search-term="searchTerm"
        multiple
        loading
        close
        :groups="groups"
        :autofocus="false"
        :fuse="{ fuseOptions: { includeMatches: true } }"
        class="h-80 max-w-md rounded-2xl bg-surface shadow-surface"
      />
      <p class="text-xs text-muted">{{ selected }} · "{{ searchTerm }}"</p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">Custom loading, close and back icons</h2>
      <CommandPalette
        :loading="{ icon: icon('arrows-rotate-right') }"
        :close="{ icon: icon('circle-xmark') }"
        :back="{ icon: icon('arrow-uturn-ccw-left') }"
        :groups="groups"
        :autofocus="false"
        class="h-80 max-w-md rounded-2xl bg-surface shadow-surface"
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">Slots and :ui override</h2>
      <CommandPalette
        :groups="groups"
        :autofocus="false"
        :ui="{ item: 'rounded-none', label: 'uppercase tracking-wide' }"
        class="h-80 max-w-md rounded-2xl bg-surface shadow-surface"
      >
        <template #header><span class="px-2 text-xs">Header slot</span></template>
        <template #item-trailing="{ item }"><span class="text-xs">{{ item.label?.length }}</span></template>
        <template #empty="{ searchTerm: term }">Nothing for "{{ term }}"</template>
        <template #footer>Footer slot</template>
      </CommandPalette>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">Virtualized, input hidden, disabled</h2>
      <div class="flex gap-4">
        <CommandPalette
          virtualize
          :groups="manyGroups"
          :fuse="{ resultLimit: 2000 }"
          :autofocus="false"
          class="h-64 w-80 rounded-2xl bg-surface shadow-surface"
        />
        <CommandPalette :input="false" :groups="groups" class="h-64 w-80 rounded-2xl bg-surface shadow-surface" />
        <CommandPalette disabled :groups="groups" :autofocus="false" class="h-64 w-80 rounded-2xl bg-surface shadow-surface" />
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm font-medium">In a Modal</h2>
      <Modal title="Command palette" placement="top" :ui="{ dialog: 'max-h-89 w-full max-w-lg overflow-hidden p-0 sm:mt-16' }">
        <Button variant="secondary" class="self-start">Open</Button>
        <template #content="{ close }">
          <CommandPalette :groups="groups" close @update:open="close" @update:model-value="close" />
        </template>
      </Modal>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

import Button from '@/components/button/Button.vue'
import { CommandPalette } from '@/components/command-palette'
import type { CommandPaletteGroup } from '@/components/command-palette'
import Modal from '@/components/modal/Modal.vue'

const sizes = ['sm', 'md', 'lg'] as const
const selected = ref([])
const searchTerm = ref('')

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { label: 'New file', icon: icon('file-plus'), kbds: ['command', 'N'] },
      { label: 'Rename', description: 'Change the name of the current file', icon: icon('pencil') },
      { label: 'Duplicate', suffix: 'copy', icon: icon('copy'), active: true },
      { label: 'Syncing', icon: icon('arrows-rotate-right'), loading: true },
      { label: 'Delete', icon: icon('trash-bin'), disabled: true },
    ],
  },
  {
    id: 'people',
    label: 'People',
    items: [
      { label: 'Ana', avatar: { src: 'https://img.heroui.chat/image/avatar?w=80&h=80&u=3', alt: '' } },
      { label: 'Online now', chip: { color: 'success' } },
      { label: 'Theme', icon: icon('palette'), children: [{ label: 'Light' }, { label: 'Dark' }] },
      { label: 'Docs', href: 'https://example.com', target: '_blank', icon: icon('book-open') },
    ],
  },
]

const manyGroups: CommandPaletteGroup[] = [
  { id: 'rows', items: Array.from({ length: 2000 }, (_, index) => ({ label: `Row ${index + 1}` })) },
]
</script>
