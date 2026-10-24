<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'
import { ref } from 'vue'

const features = [
  {
    value: 'format-on-save',
    label: 'Format on save',
    description: 'Run the formatter whenever a file is saved',
    shortcut: 'Alt+Shift+F',
  },
  {
    value: 'inlay-hints',
    label: 'Inlay hints',
    description: 'Show parameter names and inferred types inline',
    shortcut: 'Ctrl+Alt+H',
  },
  {
    value: 'minimap',
    label: 'Minimap',
    description: 'Display a code overview next to the scrollbar',
    shortcut: 'Ctrl+M',
  },
]

const enabled = ref(['format-on-save'])
</script>

<template>
  <div class="flex w-[360px] flex-col gap-4">
    <CheckboxButtonGroup
      v-model="enabled"
      name="editor-features"
      label="Editor"
      description="Turn on the tools you use every day"
      variant="secondary"
    >
      <CheckboxButtonGroupItem
        v-for="feature in features"
        :key="feature.value"
        :value="feature.value"
        :label="feature.label"
        :description="feature.description"
      >
        <kbd class="mt-2 w-fit rounded-md bg-default px-1.5 py-0.5 font-mono text-xs text-muted">{{
          feature.shortcut
        }}</kbd>
      </CheckboxButtonGroupItem>
    </CheckboxButtonGroup>
    <p class="text-sm text-muted">
      Enabled:
      <span class="font-medium text-foreground">{{ enabled.join(', ') || 'Nothing' }}</span>
    </p>
  </div>
</template>
