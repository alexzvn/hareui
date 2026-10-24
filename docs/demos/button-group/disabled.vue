<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">All buttons disabled</p>
      <ButtonGroup disabled separator>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">Group disabled, but one button overrides</p>
      <ButtonGroup disabled separator>
        <Button>First</Button>
        <Button>Second</Button>
        <Button :disabled="false"> Third (enabled) </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'
</script>
