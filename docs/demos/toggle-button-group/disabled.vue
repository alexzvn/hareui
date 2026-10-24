<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">All buttons disabled</span>
      <ToggleButtonGroup disabled selection-mode="multiple" separator>
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
      <span class="text-sm text-muted">Individual button disabled</span>
      <ToggleButtonGroup selection-mode="multiple" separator>
        <ToggleButton icon-only aria-label="Bold" value="bold">
          <Icon icon="gravity-ui:bold" />
        </ToggleButton>
        <ToggleButton disabled icon-only aria-label="Italic" value="italic">
          <Icon icon="gravity-ui:italic" />
        </ToggleButton>
        <ToggleButton icon-only aria-label="Underline" value="underline">
          <Icon icon="gravity-ui:underline" />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  </div>
</template>
