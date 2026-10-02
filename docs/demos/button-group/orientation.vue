<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, ButtonGroup } from 'herouse'
</script>

<template>
  <div class="flex items-start gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Horizontal</span>
      <ButtonGroup orientation="horizontal" separator variant="tertiary">
        <Button icon-only aria-label="Align left">
          <Icon icon="gravity-ui:text-align-left" />
        </Button>
        <Button icon-only aria-label="Align center">
          <Icon icon="gravity-ui:text-align-center" />
        </Button>
        <Button icon-only aria-label="Align right">
          <Icon icon="gravity-ui:text-align-right" />
        </Button>
        <Button icon-only aria-label="Justify">
          <Icon icon="gravity-ui:text-align-justify" />
        </Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-sm text-muted">Vertical</span>
      <ButtonGroup orientation="vertical" separator variant="tertiary">
        <Button icon-only aria-label="Align left">
          <Icon icon="gravity-ui:text-align-left" />
        </Button>
        <Button icon-only aria-label="Align center">
          <Icon icon="gravity-ui:text-align-center" />
        </Button>
        <Button icon-only aria-label="Align right">
          <Icon icon="gravity-ui:text-align-right" />
        </Button>
        <Button icon-only aria-label="Justify">
          <Icon icon="gravity-ui:text-align-justify" />
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>
