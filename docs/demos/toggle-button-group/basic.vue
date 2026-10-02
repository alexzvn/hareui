<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton, ToggleButtonGroup } from 'herouse'
</script>

<template>
  <ToggleButtonGroup selection-mode="multiple" separator>
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
</template>
