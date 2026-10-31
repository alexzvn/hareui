import type { DefaultTheme } from 'vitepress'

import { COMPONENT_GROUPS, NEW_COMPONENTS, UPDATED_COMPONENTS } from './componentGroups'

export type SidebarLink = {
  text: string
  link: string
  icon?: string
  /** Chip shown after the text, as on heroui.com. */
  badge?: 'new' | 'updated'
}

export type SidebarSeparator = {
  separator: string
}

/** Collapsible group of links; open by default. */
export type SidebarGroup = {
  group: string
  items: SidebarLink[]
}

export type SidebarEntry = SidebarLink | SidebarSeparator | SidebarGroup

export type SidebarSection = {
  text: string
  icon: string
  base: string
  items: SidebarEntry[]
}

const gs = (page: string) => `/docs/getting-started/${page}`
const c = (page: string) => `/docs/components/${page}`
const r = (page: string) => `/docs/releases/${page}`

// `color-swatch-picker` → `ColorSwatchPicker`, the component name
const pascal = (slug: string) => slug.replace(/(?:^|-)(\w)/g, (_, ch: string) => ch.toUpperCase())

const componentBadge = (slug: string) => {
  if (NEW_COMPONENTS.has(slug)) return 'new' as const
  if (UPDATED_COMPONENTS.has(slug)) return 'updated' as const

  return undefined
}

export const sidebar: SidebarSection[] = [
  {
    text: 'Getting Started',
    icon: 'book-open',
    base: '/docs/getting-started',
    items: [
      { separator: 'Overview' },
      { text: 'Introduction', link: gs(''), icon: 'book-open' },
      { text: 'Quick Start', link: gs('quick-start'), icon: 'rocket' },
      { text: 'Design Principles', link: gs('design-principles'), icon: 'book' },
      { text: 'Frameworks', link: gs('frameworks'), icon: 'layers' },
      { separator: 'Handbook' },
      { text: 'Colors', link: gs('colors'), icon: 'bucket-paint' },
      { text: 'Theming', link: gs('theming'), icon: 'palette' },
      { text: 'Dark Mode', link: gs('dark-mode'), icon: 'moon' },
      { text: 'Styling', link: gs('styling'), icon: 'brush' },
      { text: 'Animation', link: gs('animation'), icon: 'copy-transparent' },
      { text: 'Composition', link: gs('composition'), icon: 'layers' },
      { text: 'Overlays', link: gs('overlays'), icon: 'layers', badge: 'new' },
      { separator: 'UI for Agents' },
      { text: 'LLMs.txt', link: gs('llms-txt') },
    ],
  },
  {
    text: 'Components',
    icon: 'circles-4-diamond',
    base: '/docs/components',
    items: [
      { separator: 'Overview' },
      { text: 'All Components (Vue)', link: c('') },
      ...Object.entries(COMPONENT_GROUPS).map(([group, slugs]) => ({
        group,
        items: slugs.map((slug) => ({
          text: pascal(slug),
          link: c(slug),
          badge: componentBadge(slug),
        })),
      })),
    ],
  },
  {
    text: 'Releases',
    icon: 'tag',
    base: '/docs/releases',
    // Newest first; add each release page at the top of the "Versions" group.
    items: [
      { separator: 'Overview' },
      { text: 'All Releases', link: r('') },
      { separator: 'Migrations' },
      { text: 'v0.4.0 → v0.5.0', link: r('migrations/v0.4.0-v0.5.0') },
      { text: 'v0.3.0 → v0.4.0', link: r('migrations/v0.3.0-v0.4.0') },
      { separator: 'Versions' },
      { text: 'v0.5.0', link: r('v0-5-0') },
      { text: 'v0.4.0', link: r('v0-4-0') },
      { text: 'v0.3.0', link: r('v0-3-0') },
      { text: 'v0.2.0', link: r('v0-2-0') },
      { text: 'v0.1.3', link: r('v0-1-3') },
      { text: 'v0.1.2', link: r('v0-1-2') },
      { text: 'v0.1.1', link: r('v0-1-1') },
      { text: 'v0.1.0', link: r('v0-1-0') },
    ],
  },
]

export const isSeparator = (entry: SidebarEntry): entry is SidebarSeparator => {
  return 'separator' in entry
}

export const isGroup = (entry: SidebarEntry): entry is SidebarGroup => {
  return 'group' in entry
}

const entryLinks = (entry: SidebarEntry): SidebarLink[] => {
  if (isSeparator(entry)) return []

  return isGroup(entry) ? entry.items : [entry]
}

export const sectionLinks = (section: SidebarSection): SidebarLink[] => {
  return section.items.flatMap(entryLinks)
}

export const normalizePath = (path: string): string => {
  const p = path
    .replace(/[?#].*$/, '')
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')

  return p.length > 1 ? p.replace(/\/$/, '') : p
}

export type ThemeConfig = {
  sidebar: SidebarSection[]
  search: DefaultTheme.Config['search']
}
