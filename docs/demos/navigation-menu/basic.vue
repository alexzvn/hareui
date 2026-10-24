<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
const file = icon('file-text')

const items: NavigationMenuItem[] = [
  {
    label: 'Guide',
    icon: icon('book-open'),
    href: '#guide',
    children: [
      {
        label: 'Introduction',
        description: 'Fully styled and customizable components for Vue.',
        icon: icon('house'),
        href: '#introduction',
      },
      {
        label: 'Installation',
        description: 'Learn how to install and configure HareUI in your application.',
        icon: icon('cloud'),
        href: '#installation',
      },
      {
        label: 'Icons',
        description: 'Use any icon set with HareUI components.',
        icon: icon('face-smile'),
        href: '#icons',
      },
      {
        label: 'Colors',
        description: 'Choose a primary and neutral color for your app.',
        icon: icon('palette'),
        href: '#colors',
      },
      {
        label: 'Theme',
        description: 'Customize the look of every component from one config.',
        icon: icon('gear'),
        href: '#theme',
      },
    ],
  },
  {
    label: 'Composables',
    icon: icon('database'),
    href: '#composables',
    children: [
      {
        label: 'useDashboard',
        description: 'Read and drive the dashboard sidebars.',
        icon: file,
        href: '#use-dashboard',
      },
      {
        label: 'useResizable',
        description: 'Resize an element with the pointer or the keyboard.',
        icon: file,
        href: '#use-resizable',
      },
    ],
  },
  {
    label: 'Components',
    icon: icon('box'),
    href: '#components',
    active: true,
    children: [
      { label: 'Link', description: 'Style any element as a link.', icon: file, href: '#link' },
      {
        label: 'Modal',
        description: 'Display a modal within your application.',
        icon: file,
        href: '#modal',
      },
      {
        label: 'NavigationMenu',
        description: 'Display a list of links.',
        icon: file,
        href: '#navigation-menu',
      },
      {
        label: 'Pagination',
        description: 'Display a list of pages.',
        icon: file,
        href: '#pagination',
      },
      {
        label: 'Popover',
        description: 'Display a non-modal dialog that floats around a trigger element.',
        icon: file,
        href: '#popover',
      },
      {
        label: 'Progress',
        description: 'Show a horizontal bar to indicate task progression.',
        icon: file,
        href: '#progress',
      },
    ],
  },
  {
    label: 'GitHub',
    icon: icon('logo-github'),
    badge: '6k',
    href: 'https://github.com/alexzvn/hareui',
    target: '_blank',
  },
  { label: 'Help', icon: icon('circle-question'), disabled: true },
]
</script>

<template>
  <NavigationMenu
    :items="items"
    :ui="{ linkLabel: 'max-sm:sr-only' }"
    class="w-full justify-center"
  />
</template>
