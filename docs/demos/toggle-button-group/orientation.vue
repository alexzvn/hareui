<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
</script>

<template>
  <div class="flex items-start gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Horizontal</span>
      <ToggleButtonGroup orientation="horizontal" selection-mode="multiple" separator>
        <ToggleButton icon-only aria-label="Bold" value="bold">
          <Icon icon="gravity-ui:bold" />
        </ToggleButton>
        <ToggleButton icon-only aria-label="Italic" value="italic">
          <Icon icon="gravity-ui:italic" />
        </ToggleButton>
        <ToggleButton icon-only aria-label="Underline" value="underline">
          <Icon icon="gravity-ui:underline" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Vertical</span>
      <ToggleButtonGroup orientation="vertical" selection-mode="multiple" separator>
        <ToggleButton icon-only aria-label="Bold" value="bold">
          <Icon icon="gravity-ui:bold" />
        </ToggleButton>
        <ToggleButton icon-only aria-label="Italic" value="italic">
          <Icon icon="gravity-ui:italic" />
        </ToggleButton>
        <ToggleButton icon-only aria-label="Underline" value="underline">
          <Icon icon="gravity-ui:underline" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  </div>
</template>
