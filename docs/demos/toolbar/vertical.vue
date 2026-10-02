<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, ButtonGroup, Separator, ToggleButton, ToggleButtonGroup, Toolbar } from 'herouse'
</script>

<template>
  <Toolbar aria-label="Tools" orientation="vertical">
    <ToggleButtonGroup aria-label="Text style" selection-mode="multiple" separator>
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
    <Separator />
    <ButtonGroup variant="tertiary" separator>
      <Button icon-only aria-label="Undo">
        <Icon icon="gravity-ui:arrow-uturn-ccw-left" />
      </Button>
      <Button icon-only aria-label="Redo">
        <Icon icon="gravity-ui:arrow-uturn-cw-right" />
      </Button>
    </ButtonGroup>
  </Toolbar>
</template>
