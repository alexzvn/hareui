import type { VNode } from 'vue'
import type { TagGroupItem } from 'herouse'
import { TagGroup } from 'herouse'
import { h } from 'vue'
import { gearPath } from '../../../../parity/icons'

// Inline SVG (no icon package dependency): mirrored verbatim in reference/src/cases/tag-group.tsx
const icon = () => h('svg', { 'viewBox': '0 0 16 16', 'width': '1em', 'height': '1em', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('path', { d: gearPath })])

const categories = ['News', 'Travel', 'Gaming', 'Shopping']
const categoryItems = categories.map(c => ({ id: c.toLowerCase(), label: c }))

const customTagClass = 'rounded-full border border-neutral-300/80 bg-white/80 px-2.5 py-1 text-sm font-medium text-neutral-700 data-[selected=true]:border-neutral-500 data-[selected=true]:bg-neutral-900 data-[selected=true]:text-neutral-50'

export const cases: Record<string, () => VNode> = {
  'tag-group-default': () => h(TagGroup, { 'aria-label': 'Tags', 'selectionMode': 'single', 'items': categoryItems }, {
    item: ({ item }: { item: TagGroupItem }) => [icon(), item.label],
  }),
  'tag-group-selected': () => h(TagGroup, { 'aria-label': 'Tags', 'selectionMode': 'single', 'defaultSelected': ['travel'], 'items': categoryItems }, {
    item: ({ item }: { item: TagGroupItem }) => [icon(), item.label],
  }),
  'tag-group-sizes': () => h('div', { class: 'flex flex-col gap-6' }, [
    h(TagGroup, { selectionMode: 'single', size: 'sm', label: 'Small', items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }] }),
    h(TagGroup, { selectionMode: 'single', size: 'md', label: 'Medium', items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }] }),
    h(TagGroup, { selectionMode: 'single', size: 'lg', label: 'Large', items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }] }),
  ]),
  'tag-group-variants': () => h('div', { class: 'flex flex-col gap-8' }, [
    h(TagGroup, { selectionMode: 'single', variant: 'default', label: 'Default', items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }] }),
    h(TagGroup, { selectionMode: 'single', variant: 'surface', label: 'Surface', items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }] }),
  ]),
  'tag-group-disabled-own': () => h(TagGroup, {
    selectionMode: 'single',
    label: 'Disabled Tags',
    description: 'Some tags are disabled',
    items: [{ id: 'news', label: 'News', disabled: true }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming', disabled: true }],
  }),
  'tag-group-disabled-keys': () => h(TagGroup, {
    selectionMode: 'single',
    label: 'Disabled Keys',
    description: 'Tags disabled via disabledKeys prop',
    disabledKeys: ['travel'],
    items: [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }],
  }),
  'tag-group-selection-modes': () => h('div', { class: 'flex flex-col gap-8' }, [
    h(TagGroup, { selectionMode: 'single', defaultSelected: ['news'], label: 'Single Selection', description: 'Choose one category', items: categoryItems }),
    h(TagGroup, { selectionMode: 'multiple', defaultSelected: ['news', 'travel'], label: 'Multiple Selection', description: 'Choose multiple categories', items: categoryItems }),
  ]),
  'tag-group-controlled': () => h(TagGroup, {
    selectionMode: 'multiple',
    defaultSelected: ['news', 'travel'],
    label: 'Categories (controlled)',
    description: 'Selected: News, Travel',
    items: categoryItems,
  }),
  'tag-group-removable': () => h('div', { class: 'w-sm' }, [
    h(TagGroup, { selectionMode: 'single', removable: true, label: 'Default Remove Button', description: 'Click the X to remove tags', items: categoryItems }),
  ]),
  'tag-group-with-prefix': () => h(TagGroup, { 'aria-label': 'Tags with icons', 'selectionMode': 'single', 'items': categoryItems }, {
    item: ({ item }: { item: TagGroupItem }) => [icon(), item.label],
  }),
  'tag-group-error-message-invalid': () => h(TagGroup, {
    selectionMode: 'multiple',
    selected: [],
    label: 'Amenities',
    description: 'Select at least one category',
    errorMessage: 'Please select at least one category',
    items: [{ id: 'laundry', label: 'Laundry' }, { id: 'fitness', label: 'Fitness center' }, { id: 'parking', label: 'Parking' }],
  }),
  'tag-group-error-message-valid': () => h(TagGroup, {
    selectionMode: 'multiple',
    defaultSelected: ['laundry'],
    label: 'Amenities',
    description: 'Selected: Laundry',
    errorMessage: '',
    items: [{ id: 'laundry', label: 'Laundry' }, { id: 'fitness', label: 'Fitness center' }, { id: 'parking', label: 'Parking' }],
  }),
  'tag-group-custom-styles': () => h(TagGroup, {
    'aria-label': 'Topics',
    'selectionMode': 'single',
    'items': [{ id: 'news', label: 'News' }, { id: 'travel', label: 'Travel' }, { id: 'gaming', label: 'Gaming' }],
    'ui': { list: 'gap-2', tag: customTagClass },
  }),
}

