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
      { separator: 'Overview' },
      { text: 'All Components (Vue)', link: c('') },
      { separator: 'Components' },
      { text: 'Accordion', link: c('accordion') },
      { text: 'Alert', link: c('alert') },
      { text: 'AlertDialog', link: c('alert-dialog') },
      { text: 'Avatar', link: c('avatar') },
      { text: 'AvatarGroup', link: c('avatar-group') },
      { text: 'Badge', link: c('badge') },
      { text: 'Breadcrumbs', link: c('breadcrumbs') },
      { text: 'Button', link: c('button') },
      { text: 'ButtonGroup', link: c('button-group') },
      { text: 'Calendar', link: c('calendar') },
      { text: 'Card', link: c('card') },
      { text: 'Checkbox', link: c('checkbox') },
      { text: 'CheckboxGroup', link: c('checkbox-group') },
      { text: 'Chip', link: c('chip') },
      { text: 'CloseButton', link: c('close-button') },
      { text: 'ColorArea', link: c('color-area') },
      { text: 'ColorField', link: c('color-field') },
      { text: 'ColorPicker', link: c('color-picker') },
      { text: 'ColorSlider', link: c('color-slider') },
      { text: 'ColorSwatch', link: c('color-swatch') },
      { text: 'ColorSwatchPicker', link: c('color-swatch-picker') },
      { text: 'ComboBox', link: c('combo-box') },
      { text: 'DateField', link: c('date-field') },
      { text: 'DatePicker', link: c('date-picker') },
      { text: 'Description', link: c('description') },
      { text: 'Disclosure', link: c('disclosure') },
      { text: 'DisclosureGroup', link: c('disclosure-group') },
      { text: 'Drawer', link: c('drawer') },
      { text: 'Dropdown', link: c('dropdown') },
      { text: 'FieldError', link: c('field-error') },
      { text: 'Fieldset', link: c('fieldset') },
      { text: 'Form', link: c('form') },
      { text: 'Input', link: c('input') },
      { text: 'InputGroup', link: c('input-group') },
      { text: 'InputOtp', link: c('input-otp') },
      { text: 'Kbd', link: c('kbd') },
      { text: 'Label', link: c('label') },
      { text: 'Link', link: c('link') },
      { text: 'ListBox', link: c('list-box') },
      { text: 'Meter', link: c('meter') },
      { text: 'Modal', link: c('modal') },
      { text: 'NumberField', link: c('number-field') },
      { text: 'Pagination', link: c('pagination') },
      { text: 'Popover', link: c('popover') },
      { text: 'ProgressBar', link: c('progress-bar') },
      { text: 'ProgressCircle', link: c('progress-circle') },
      { text: 'RadioGroup', link: c('radio-group') },
      { text: 'RangeCalendar', link: c('range-calendar') },
      { text: 'ScrollShadow', link: c('scroll-shadow') },
      { text: 'SearchField', link: c('search-field') },
      { text: 'Select', link: c('select') },
      { text: 'Separator', link: c('separator') },
      { text: 'Skeleton', link: c('skeleton') },
      { text: 'Slider', link: c('slider') },
      { text: 'Spinner', link: c('spinner') },
      { text: 'Surface', link: c('surface') },
      { text: 'Switch', link: c('switch') },
      { text: 'Table', link: c('table') },
      { text: 'Tabs', link: c('tabs') },
      { text: 'TagGroup', link: c('tag-group') },
      { text: 'TextArea', link: c('text-area') },
      { text: 'TextField', link: c('text-field') },
      { text: 'TimeField', link: c('time-field') },
      { text: 'Toast', link: c('toast') },
      { text: 'ToggleButton', link: c('toggle-button') },
      { text: 'ToggleButtonGroup', link: c('toggle-button-group') },
      { text: 'Toolbar', link: c('toolbar') },
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
