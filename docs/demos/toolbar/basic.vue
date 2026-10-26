<template>
  <Toolbar aria-label="Text formatting">
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
      <Button icon-only aria-label="Copy">
        <Icon icon="gravity-ui:copy" />
      </Button>
      <Button icon-only aria-label="Cut">
        <Icon icon="gravity-ui:scissors" />
      </Button>
    </ButtonGroup>
  </Toolbar>
</template>

<script setup lang="ts">
import {
  Button,
  ButtonGroup,
  Separator,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
