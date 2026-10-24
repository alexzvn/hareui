<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">With icons</p>
      <ButtonGroup separator variant="secondary">
        <Button>
          <Icon icon="gravity-ui:globe" />
          Search
        </Button>
        <Button>
          <Icon icon="gravity-ui:plus" />
          Add
        </Button>
        <Button>
          <Icon icon="gravity-ui:trash-bin" />
          Delete
        </Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">Icon only buttons</p>
      <ButtonGroup separator variant="tertiary">
        <Button icon-only aria-label="Search">
          <Icon icon="gravity-ui:globe" />
        </Button>
        <Button icon-only aria-label="Add">
          <Icon icon="gravity-ui:plus" />
        </Button>
        <Button icon-only aria-label="Delete">
          <Icon icon="gravity-ui:trash-bin" />
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
