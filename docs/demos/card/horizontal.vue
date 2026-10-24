<template>
  <!-- #leading and the content wrapper become the two columns of the md:flex-row root -->
  <Card class="w-full items-stretch md:flex-row" :ui="{ content: 'gap-3' }">
    <template #leading>
      <div
        class="relative h-[140px] w-full shrink-0 overflow-hidden rounded-2xl sm:h-[120px] sm:w-[120px]"
      >
        <img
          alt="Cherries"
          class="pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/cherries.jpeg"
        />
      </div>
    </template>
    <div class="flex flex-col gap-1">
      <h3 class="pe-8 text-sm leading-6 font-medium text-foreground">Become an ACME Creator!</h3>
      <p class="text-sm leading-5 text-muted">
        Lorem ipsum dolor sit amet consectetur. Sed arcu donec id aliquam dolor sed amet faucibus
        etiam.
      </p>
      <CloseButton aria-label="Close banner" class="absolute end-3 top-3" />
    </div>
    <div
      class="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col">
        <span class="text-sm font-medium text-foreground">Only 10 spots</span>
        <span class="text-xs text-muted">Submission ends Oct 10.</span>
      </div>
      <Button class="w-full sm:w-auto">Apply Now</Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card, CloseButton } from '@hareui/vue'
</script>
