<template>
  <Toolbar
    aria-label="Formatting toolbar"
    class="gap-1 rounded-xl border border-border/80 bg-surface-secondary p-1.5"
  >
    <ToggleButtonGroup aria-label="Text style" class="gap-0.5" selection-mode="multiple">
      <ToggleButton icon-only aria-label="Bold" :class="toggleClass" value="bold">
        <Icon icon="gravity-ui:bold" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Italic" :class="toggleClass" value="italic">
        <Icon icon="gravity-ui:italic" />
      </ToggleButton>
      <ToggleButton icon-only aria-label="Underline" :class="toggleClass" value="underline">
        <Icon icon="gravity-ui:underline" />
      </ToggleButton>
    </ToggleButtonGroup>
  </Toolbar>
</template>

<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup, Toolbar } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const toggleClass =
  'rounded-lg data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground'
</script>
