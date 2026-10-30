<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Primary</p>
      <ButtonGroup separator variant="primary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Secondary</p>
      <ButtonGroup separator variant="secondary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Tertiary</p>
      <ButtonGroup separator variant="tertiary">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Outline</p>
      <ButtonGroup separator variant="outline">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Ghost</p>
      <ButtonGroup separator variant="ghost">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm text-muted">Danger</p>
      <ButtonGroup separator variant="danger">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'
</script>
