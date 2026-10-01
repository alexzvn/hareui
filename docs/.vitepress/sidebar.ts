import type { DefaultTheme } from 'vitepress'

export interface SidebarLink {
  text: string
  link: string
  icon?: string
}

export interface SidebarSeparator {
  separator: string
}

export interface SidebarGroup {
  text: string
  items: SidebarLink[]
  collapsed?: boolean
}

export type SidebarEntry = SidebarLink | SidebarSeparator | SidebarGroup

export interface SidebarSection {
  text: string
  icon: string
  base: string
  items: SidebarEntry[]
}

const gs = (page: string) => `/docs/getting-started/${page}`
const c = (page: string) => `/docs/components/${page}`

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
      { separator: 'UI for Agents' },
      { text: 'LLMs.txt', link: gs('llms-txt') },
    ],
  },
  {
    text: 'Components',
    icon: 'circles-4-diamond',
    base: '/docs/components',
    items: [
      { text: 'Navigation', items: [{ text: 'Tabs', link: c('tabs') }] },
      { text: 'Feedback', items: [{ text: 'Spinner', link: c('spinner') }] },
      {
        text: 'Buttons',
        items: [
          { text: 'Button', link: c('button') },
          { text: 'CloseButton', link: c('close-button') },
        ],
      },
      { text: 'Layout', items: [{ text: 'Card', link: c('card') }] },
      {
        text: 'Forms',
        items: [
          { text: 'TextField', link: c('text-field') },
          { text: 'Input', link: c('input') },
          { text: 'Label', link: c('label') },
          { text: 'RadioGroup', link: c('radio-group') },
          { text: 'Checkbox', link: c('checkbox') },
          { text: 'Description', link: c('description') },
          { text: 'FieldError', link: c('field-error') },
        ],
      },
      { text: 'Media', items: [{ text: 'Avatar', link: c('avatar') }] },
      { text: 'Data Display', items: [{ text: 'Chip', link: c('chip') }] },
      {
        text: 'Overlays',
        items: [
          { text: 'Modal', link: c('modal') },
          { text: 'Popover', link: c('popover') },
          { text: 'Tooltip', link: c('tooltip') },
        ],
      },
      { text: 'Controls', items: [{ text: 'Switch', link: c('switch') }] },
    ],
  },
]

export function isSeparator(entry: SidebarEntry): entry is SidebarSeparator {
  return 'separator' in entry
}

export function isGroup(entry: SidebarEntry): entry is SidebarGroup {
  return 'items' in entry
}
export function sectionLinks(section: SidebarSection): SidebarLink[] {
  return section.items.flatMap((entry) =>
    isSeparator(entry) ? [] : isGroup(entry) ? entry.items : [entry],
  )
}
export function normalizePath(path: string): string {
  const p = path.replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/index$/, '')
  return p.length > 1 ? p.replace(/\/$/, '') : p
}

export interface ThemeConfig {
  sidebar: SidebarSection[]
  search: DefaultTheme.Config['search']
}
