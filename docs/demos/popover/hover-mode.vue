<template>
  <div class="flex items-center gap-4">
    <Popover mode="hover" title="Maya Chen" class="max-w-64">
      <Button variant="secondary">@maya</Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">Product designer at Northwind, based in Lisbon.</p>
      </template>
    </Popover>
    <Popover
      mode="hover"
      :open-delay="150"
      :close-delay="100"
      enable-touch
      arrow
      title="Fix login redirect"
      class="max-w-64"
    >
      <Button variant="tertiary">Issue #1284</Button>
      <template #content>
        <p class="mt-2 text-sm text-muted">Opened 2 days ago by Sam Rivera · 3 comments</p>
      </template>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Button, Popover } from '@hareui/vue'
</script>
