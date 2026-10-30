<template>
  <Toolbar aria-label="Editor toolbar">
    <ButtonGroup variant="tertiary" separator>
      <Button>
        <Icon icon="gravity-ui:arrow-uturn-ccw-left" />
        Undo
      </Button>
      <Button>
        <Icon icon="gravity-ui:arrow-uturn-cw-right" />
        Redo
      </Button>
    </ButtonGroup>
    <Separator />
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
      <Button icon-only aria-label="Align left">
        <Icon icon="gravity-ui:text-align-left" />
      </Button>
      <Button icon-only aria-label="Align center">
        <Icon icon="gravity-ui:text-align-center" />
      </Button>
      <Button icon-only aria-label="Align right">
        <Icon icon="gravity-ui:text-align-right" />
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
