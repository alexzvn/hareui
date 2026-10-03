<script setup lang="ts">
import { Card } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card class="w-[320px]" description="Minimal prominence with transparent background" title="Transparent" variant="transparent">
      <p>Use for less important content or nested cards</p>
    </Card>

    <Card class="w-[320px]" description="Standard card appearance (bg-surface)" title="Default" variant="default">
      <p>The default card variant for most use cases</p>
    </Card>

    <Card class="w-[320px]" description="Medium prominence (bg-surface-secondary)" title="Secondary" variant="secondary">
      <p>Use to draw moderate attention</p>
    </Card>

    <Card class="w-[320px]" description="Higher prominence (bg-surface-tertiary)" title="Tertiary" variant="tertiary">
      <p>Use for primary or featured content</p>
    </Card>
  </div>
</template>
