<script setup lang="ts">
import { Card } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card class="w-[320px]" variant="transparent">
      <template #header>
        <h3 class="text-sm leading-6 font-medium text-foreground">Transparent</h3>
        <p class="text-sm leading-5 text-muted">Minimal prominence with transparent background</p>
      </template>
      <p>Use for less important content or nested cards</p>
    </Card>

    <Card class="w-[320px]" variant="default">
      <template #header>
        <h3 class="text-sm leading-6 font-medium text-foreground">Default</h3>
        <p class="text-sm leading-5 text-muted">Standard card appearance (bg-surface)</p>
      </template>
      <p>The default card variant for most use cases</p>
    </Card>

    <Card class="w-[320px]" variant="secondary">
      <template #header>
        <h3 class="text-sm leading-6 font-medium text-foreground">Secondary</h3>
        <p class="text-sm leading-5 text-muted">Medium prominence (bg-surface-secondary)</p>
      </template>
      <p>Use to draw moderate attention</p>
    </Card>

    <Card class="w-[320px]" variant="tertiary">
      <template #header>
        <h3 class="text-sm leading-6 font-medium text-foreground">Tertiary</h3>
        <p class="text-sm leading-5 text-muted">Higher prominence (bg-surface-tertiary)</p>
      </template>
      <p>Use for primary or featured content</p>
    </Card>
  </div>
</template>
