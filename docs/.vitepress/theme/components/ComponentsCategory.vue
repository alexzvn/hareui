<script setup lang="ts">
import { computed } from 'vue'
import ComponentItem from './ComponentItem.vue'
import { componentPages } from './componentPages'

// Port of HeroUI docs' components-category.tsx. Groups and order are HeroUI's; components
// herouse has no docs page for are skipped, as HeroUI skips paths without a page.
const COMPONENT_GROUPS: Record<string, readonly string[]> = {
  'Buttons': ['button', 'button-group', 'close-button', 'toggle-button', 'toggle-button-group'],
  'Forms': [
    'checkbox',
    'checkbox-group',
    'description',
    'error-message',
    'field-error',
    'fieldset',
    'form',
    'input',
    'input-group',
    'input-otp',
    'label',
    'number-field',
    'radio-group',
    'search-field',
    'text-field',
    'text-area',
  ],
  'Date and Time': ['calendar', 'date-field', 'date-picker', 'date-range-picker', 'range-calendar', 'time-field'],
  'Navigation': ['accordion', 'breadcrumbs', 'disclosure', 'disclosure-group', 'link', 'pagination', 'tabs'],
  'Overlays': ['alert-dialog', 'drawer', 'modal', 'popover', 'toast', 'tooltip'],
  'Collections': ['dropdown', 'list-box', 'tag-group'],
  'Controls': ['slider', 'switch'],
  'Feedback': ['alert', 'meter', 'progress-bar', 'progress-circle', 'skeleton', 'spinner'],
  'Layout': ['card', 'separator', 'surface', 'toolbar'],
  'Media': ['avatar', 'avatar-group'],
  'Pickers': ['autocomplete', 'combo-box', 'select'],
  'Typography': ['kbd', 'typography'],
  'Data Display': ['badge', 'chip', 'table'],
  'Colors': ['color-area', 'color-field', 'color-picker', 'color-slider', 'color-swatch', 'color-swatch-picker'],
  'Utilities': ['scroll-shadow'],
}

const props = defineProps<{ category: string }>()

const components = computed(() => componentPages(COMPONENT_GROUPS[props.category] ?? []))
</script>

<template>
  <div v-if="components.length" class="not-prose flex flex-col gap-12">
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <ComponentItem v-for="component in components" :key="component.slug" :slug="component.slug" :title="component.title" />
      </div>
    </div>
  </div>
</template>
