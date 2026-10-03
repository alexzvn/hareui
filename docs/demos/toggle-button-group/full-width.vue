<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
</script>

<template>
  <div class="w-full max-w-md space-y-3">
    <ToggleButtonGroup full-width selection-mode="multiple" separator>
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
    <ToggleButtonGroup full-width selection-mode="single" separator>
      <ToggleButton value="left">
        <Icon icon="gravity-ui:text-align-left" />
        Left
      </ToggleButton>
      <ToggleButton value="center">
        <Icon icon="gravity-ui:text-align-center" />
        Center
      </ToggleButton>
      <ToggleButton value="right">
        <Icon icon="gravity-ui:text-align-right" />
        Right
      </ToggleButton>
    </ToggleButtonGroup>
  </div>
</template>
