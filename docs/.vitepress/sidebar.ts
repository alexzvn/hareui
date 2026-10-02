import type { DefaultTheme } from 'vitepress'

export interface SidebarLink {
  text: string
  link: string
  icon?: string
}

export interface SidebarSeparator {
  separator: string
}

export type SidebarEntry = SidebarLink | SidebarSeparator

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
    // HeroUI's components meta.json lists pages alphabetically under one "Components" separator.
    items: [
      { separator: 'Components' },
      { text: 'Alert', link: c('alert') },
      { text: 'Avatar', link: c('avatar') },
      { text: 'Badge', link: c('badge') },
      { text: 'Button', link: c('button') },
      { text: 'Card', link: c('card') },
      { text: 'Checkbox', link: c('checkbox') },
      { text: 'Chip', link: c('chip') },
      { text: 'CloseButton', link: c('close-button') },
      { text: 'Description', link: c('description') },
      { text: 'Disclosure', link: c('disclosure') },
      { text: 'FieldError', link: c('field-error') },
      { text: 'Fieldset', link: c('fieldset') },
      { text: 'Form', link: c('form') },
      { text: 'Input', link: c('input') },
      { text: 'Kbd', link: c('kbd') },
      { text: 'Label', link: c('label') },
      { text: 'Link', link: c('link') },
      { text: 'ListBox', link: c('list-box') },
      { text: 'Modal', link: c('modal') },
      { text: 'NumberField', link: c('number-field') },
      { text: 'Popover', link: c('popover') },
      { text: 'ProgressBar', link: c('progress-bar') },
      { text: 'RadioGroup', link: c('radio-group') },
      { text: 'Select', link: c('select') },
      { text: 'Separator', link: c('separator') },
      { text: 'Skeleton', link: c('skeleton') },
      { text: 'Spinner', link: c('spinner') },
      { text: 'Surface', link: c('surface') },
      { text: 'Switch', link: c('switch') },
      { text: 'Tabs', link: c('tabs') },
      { text: 'TextArea', link: c('text-area') },
      { text: 'TextField', link: c('text-field') },
      { text: 'Toast', link: c('toast') },
      { text: 'Tooltip', link: c('tooltip') },
      { text: 'Typography', link: c('typography') },
    ],
  },
]

export function isSeparator(entry: SidebarEntry): entry is SidebarSeparator {
  return 'separator' in entry
}

export function sectionLinks(section: SidebarSection): SidebarLink[] {
  return section.items.filter((entry): entry is SidebarLink => !isSeparator(entry))
}
export function normalizePath(path: string): string {
  const p = path.replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/index$/, '')
  return p.length > 1 ? p.replace(/\/$/, '') : p
}

export interface ThemeConfig {
  sidebar: SidebarSection[]
  search: DefaultTheme.Config['search']
}
