<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const site = (): TreeItem[] => [
  {
    label: 'site',
    defaultExpanded: true,
    children: [
      {
        label: 'pages',
        defaultExpanded: true,
        children: [{ label: 'index.vue' }, { label: 'about.vue' }, { label: 'pricing.vue', disabled: true }],
      },
      { label: 'assets', children: [{ label: 'logo.svg' }, { label: 'hero.png' }] },
      { label: 'drafts', children: [] },
      { label: 'theme.css' },
    ],
  },
  { label: 'config.toml' },
  { label: 'CHANGELOG.md' },
]

const iconOf = (item: TreeItem, expanded: boolean) => {
  if (item.children) return expanded ? 'gravity-ui:folder-open' : 'gravity-ui:folder'
  if (item.label?.endsWith('.vue')) return 'gravity-ui:file-code'
  if (item.label?.endsWith('.css')) return 'gravity-ui:palette'
  if (item.label?.endsWith('.svg') || item.label?.endsWith('.png')) return 'gravity-ui:picture'
  if (item.label?.endsWith('.toml')) return 'gravity-ui:gear'

  return 'gravity-ui:file-text'
}

const items = site()
const selected = ref<TreeItem>()
const checked = ref<TreeItem[]>([])
const expanded = ref<string[]>(['site', 'pages'])

const large: TreeItem[] = Array.from({ length: 40 }, (_, folder) => ({
  label: `chapter-${folder + 1}`,
  defaultExpanded: folder < 3,
  children: Array.from({ length: 50 }, (_, page) => ({ label: `chapter-${folder + 1}/page-${page + 1}.md` })),
}))

const withTrailing: TreeItem[] = [
  {
    label: 'inbox',
    defaultExpanded: true,
    children: [
      { label: 'invoice-0412.pdf', badge: 'new' },
      { label: 'meeting-notes.md' },
      { label: 'roadmap.md', slot: 'starred' },
    ],
  },
]
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Tree</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default (v-model, folder icons)</h2>
      <Tree v-model="selected" :items="items" class="w-80" />
      <p class="mt-2 text-xs text-muted">Selected: {{ selected?.label ?? 'none' }}</p>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#item-leading with file-type icons</h2>
      <Tree :items="site()" class="w-80">
        <template #item-leading="{ item, expanded: isOpen, ui }">
          <Icon :icon="iconOf(item, isOpen)" :class="ui.linkLeadingIcon()" />
        </template>
      </Tree>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">sizes</h2>
      <div class="flex gap-6">
        <div v-for="size in ['sm', 'md', 'lg'] as const" :key="size" class="w-72">
          <p class="mb-1 text-xs text-muted">{{ size }}</p>
          <Tree :items="site()" :size="size" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">show-guide-lines</h2>
      <div class="flex gap-6">
        <div v-for="mode in [true, 'hover', false] as const" :key="String(mode)" class="w-72">
          <p class="mb-1 text-xs text-muted">{{ mode }}</p>
          <Tree :items="site()" :show-guide-lines="mode" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">color="accent", multiple, propagate-select + bubble-select, v-model:expanded</h2>
      <Tree
        v-model="checked"
        v-model:expanded="expanded"
        :items="items"
        color="accent"
        multiple
        propagate-select
        bubble-select
        class="w-80"
      >
        <template #item-leading="{ selected: isChecked, indeterminate }">
          <span class="flex size-4 items-center justify-center rounded border border-border text-[10px]">
            {{ indeterminate ? '–' : isChecked ? '✓' : '' }}
          </span>
        </template>
      </Tree>
      <p class="mt-2 text-xs text-muted">Checked: {{ checked.map(item => item.label).join(', ') || 'none' }} · Expanded: {{ expanded.join(', ') }}</p>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">selection-behavior="replace"</h2>
      <Tree :items="site()" multiple selection-behavior="replace" class="w-80" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#item-trailing and an item slot</h2>
      <Tree :items="withTrailing" class="w-80">
        <template #item-trailing="{ item }">
          <span v-if="item.badge" class="rounded-full bg-accent-soft px-1.5 text-[10px] text-accent-soft-foreground">{{ item.badge }}</span>
        </template>
        <template #starred-label="{ item }">
          <span class="font-medium">{{ item.label }}</span>
        </template>
        <template #starred-trailing>
          <Icon icon="gravity-ui:star" class="size-3.5" />
        </template>
      </Tree>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled tree</h2>
      <Tree :items="site()" disabled class="w-80" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">nested=false</h2>
      <Tree :items="site()" :nested="false" class="w-80" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">virtualize (2,040 rows)</h2>
      <Tree :items="large" virtualize class="h-80 w-80" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Tree
        :items="site()"
        :ui="{ root: 'rounded-xl bg-surface shadow-surface', link: 'data-selected:bg-accent data-selected:text-accent-foreground' }"
        class="w-80"
      />
    </section>
  </div>
</template>
