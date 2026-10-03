<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">Small</p>
      <ButtonGroup separator size="sm" variant="secondary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">Medium (default)</p>
      <ButtonGroup separator size="md" variant="secondary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col items-start gap-2">
      <p class="text-sm text-muted">Large</p>
      <ButtonGroup separator size="lg" variant="secondary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
  </div>
</template>
