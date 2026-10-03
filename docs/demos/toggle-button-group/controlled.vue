<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { ref } from 'vue'

const selected = ref(['bold'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <ToggleButtonGroup v-model="selected" selection-mode="multiple" separator>
      <ToggleButton icon-only aria-label="Bold" value="bold">
        <Icon icon="gravity-ui:bold" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Italic" value="italic">
        <Icon icon="gravity-ui:italic" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Underline" value="underline">
        <Icon icon="gravity-ui:underline" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Strikethrough" value="strikethrough">
        <Icon icon="gravity-ui:strikethrough" />
      </ToggleButton>
    </ToggleButtonGroup>
    <p class="text-sm text-muted">
      Selected:
      <span class="font-medium">{{ selected.length > 0 ? selected.join(', ') : 'None' }}</span>
    </p>
  </div>
</template>
