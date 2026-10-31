<template>
  <ItemCard
    title="Close workspace"
    description="Archives every project and removes all members"
    class="w-full max-w-md"
  >
    <template #action>
      <Button size="sm" variant="danger-soft">Close</Button>
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { Button, ItemCard } from '@hareui/vue'
</script>
