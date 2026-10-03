<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Small</span>
      <ToggleButtonGroup selection-mode="multiple" separator size="sm">
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
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Medium (default)</span>
      <ToggleButtonGroup selection-mode="multiple" separator size="md">
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
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Large</span>
      <ToggleButtonGroup selection-mode="multiple" separator size="lg">
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
    </div>
  </div>
</template>
