<template>
  <RichTable
    :data="data"
    :columns="columns"
    :get-sub-rows="(row) => row.children"
    :initial-state="{ expanded: { 0: true } }"
    class="w-full"
  />
</template>

<script setup lang="ts">
import type { RichTableColumn, RichTableRow } from '@hareui/vue'
import { Button, Chip, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

type Node = {
  name: string
  type: 'Folder' | 'PDF' | 'Sheet' | 'Text' | 'Image'
  size: string
  modified: string
  children?: Node[]
}

const data: Node[] = [
  {
    name: 'Documents',
    type: 'Folder',
    size: '3 items',
    modified: 'Oct 20, 2025',
    children: [
      {
        name: 'Project Alpha',
        type: 'Folder',
        size: '2 items',
        modified: 'Aug 2, 2025',
        children: [
          { name: 'Brief.pdf', type: 'PDF', size: '2 MB', modified: 'Jul 30, 2025' },
          { name: 'Budget.xlsx', type: 'Sheet', size: '48 KB', modified: 'Aug 2, 2025' },
        ],
      },
      { name: 'Meeting Notes.md', type: 'Text', size: '12 KB', modified: 'Sep 14, 2025' },
    ],
  },
  {
    name: 'Photos',
    type: 'Folder',
    size: '2 items',
    modified: 'Feb 3, 2026',
    children: [
      { name: 'Holiday.jpg', type: 'Image', size: '3 MB', modified: 'Jan 12, 2026' },
      { name: 'Portrait.png', type: 'Image', size: '5 MB', modified: 'Feb 3, 2026' },
    ],
  },
  { name: 'readme.txt', type: 'Text', size: '4 KB', modified: 'Mar 1, 2026' },
]

// A ghost button whose muted chevron turns from right to down.
const expandToggle = (row: RichTableRow<Node>) => {
  const isExpanded = row.getIsExpanded()
  return h(
    Button,
    {
      variant: 'ghost',
      size: 'sm',
      iconOnly: true,
      class: 'h-5 w-7 shrink-0',
      'aria-label': isExpanded ? `Collapse ${row.original.name}` : `Expand ${row.original.name}`,
      'aria-expanded': isExpanded,
      onClick: row.getToggleExpandedHandler(),
    },
    () =>
      h(Icon, {
        icon: 'gravity-ui:chevron-right',
        class: [
          'size-4 text-muted transition-transform duration-150 ease-out motion-reduce:transition-none',
          isExpanded ? 'rotate-90' : 'rtl:rotate-180',
        ],
      }),
  )
}

const nodeIcon = (row: RichTableRow<Node>) => {
  if (row.original.type !== 'Folder') return 'gravity-ui:file'

  return row.getIsExpanded() ? 'gravity-ui:folder-open' : 'gravity-ui:folder'
}

const columns: RichTableColumn<Node>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    // Indent 16px a level; rows without sub rows keep the toggle's space so siblings line up
    cell: ({ row }) => {
      const isFolder = row.original.type === 'Folder'

      return h(
        'div',
        { class: 'flex h-6 items-center gap-1', style: { paddingInlineStart: `${row.depth}rem` } },
        [
          row.getCanExpand() ? expandToggle(row) : h('span', { class: 'w-7 shrink-0' }),
          h('span', { class: 'flex items-center gap-2' }, [
            h(Icon, {
              icon: nodeIcon(row),
              class: ['size-4 shrink-0', isFolder ? 'text-warning' : 'text-muted'],
            }),
            row.original.name,
          ]),
        ],
      )
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) =>
      h(
        Chip,
        {
          color: row.original.type === 'Folder' ? 'warning' : 'default',
          variant: 'soft',
          size: 'sm',
        },
        () => row.original.type,
      ),
  },
  {
    accessorKey: 'size',
    header: () => h('div', { class: 'text-end' }, 'Size'),
    meta: { class: { td: 'text-end text-muted' } },
  },
  { accessorKey: 'modified', header: 'Date Modified', meta: { class: { td: 'text-muted' } } },
]
</script>
