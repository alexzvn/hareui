import type { VNode } from 'vue'
import { ComboBox } from 'herouse'
import { defineComponent, h, onMounted, ref } from 'vue'
import { gear } from '../icons'

const animals = ['Aardvark', 'Cat', 'Dog', 'Kangaroo', 'Panda', 'Snake'].map(label => ({ value: label.toLowerCase(), label }))
const base = { class: 'w-[256px]', label: 'Favorite Animal', placeholder: 'Search animals...', items: animals }
const sections = [
  { type: 'section' as const, label: 'North America', items: ['United States', 'Canada'].map(c => ({ value: c, label: c })) },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'Europe', items: ['France', 'Germany'].map(c => ({ value: c, label: c })) },
]

// Same as the React case: RAC has no `defaultOpen`, so the reference focuses the input after mount
const Open = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    const el = ref<HTMLElement>()
    onMounted(() => setTimeout(() => el.value?.querySelector('input')?.focus(), 50))
    return () => h('div', { ref: el }, [h(ComboBox, { ...attrs, defaultOpen: true })])
  },
})

export const cases: Record<string, () => VNode> = {
  'combo-box-default': () => h(ComboBox, base),
  'combo-box-selected': () => h(ComboBox, { ...base, defaultValue: 'cat' }),
  'combo-box-secondary': () => h(ComboBox, { ...base, variant: 'secondary' }),
  'combo-box-disabled': () => h(ComboBox, { ...base, disabled: true, defaultValue: 'cat' }),
  'combo-box-invalid': () => h(ComboBox, { ...base, invalid: true, description: 'Pick an animal', errorMessage: 'Please select an animal' }),
  'combo-box-description': () => h(ComboBox, { ...base, description: 'Search and select your favorite animal' }),
  'combo-box-required': () => h(ComboBox, { ...base, required: true }),
  'combo-box-read-only': () => h(ComboBox, { ...base, readonly: true, defaultValue: 'cat' }),
  'combo-box-full-width': () => h('div', { class: 'w-[400px]' }, [h(ComboBox, { ...base, class: undefined, fullWidth: true })]),
  'combo-box-custom-indicator': () => h(ComboBox, base, { indicator: () => gear() }),
  'combo-box-multiple': () => h(ComboBox, { ...base, label: 'Favorite Animals', selectionMode: 'multiple', defaultValue: ['cat', 'dog'], valuePlaceholder: 'No animals selected' }),
  'combo-box-open': () => h(Open, { ...base, defaultValue: 'cat' }),
  'combo-box-open-sections': () => h(Open, { ...base, 'label': undefined, 'aria-label': 'Country', 'items': sections }),
  'combo-box-user-overrides': () => h(ComboBox, { ...base, ui: { inputGroup: 'rounded-xl bg-accent-soft', trigger: 'text-accent' } }),
}
