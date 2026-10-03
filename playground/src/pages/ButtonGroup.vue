<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'

const variants = ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      ButtonGroup
    </h1>
    <section class="flex flex-col items-start gap-3">
      <ButtonGroup v-for="variant in variants" :key="variant" :variant="variant" separator>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    </section>
    <section class="flex items-start gap-6">
      <ButtonGroup orientation="vertical" variant="secondary" separator>
        <Button>Top</Button>
        <Button>Middle</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
      <ButtonGroup disabled>
        <Button>Disabled</Button>
        <Button :disabled="false">
          Enabled
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" :ui="{ separator: 'opacity-50' }" separator>
        <Button>Small</Button>
        <Button class="rounded-none">
          Square
        </Button>
      </ButtonGroup>
    </section>
    <ButtonGroup full-width separator class="max-w-md">
      <Button>Full</Button>
      <Button>Width</Button>
    </ButtonGroup>
  </div>
</template>
