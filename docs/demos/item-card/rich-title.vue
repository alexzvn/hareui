<template>
  <ItemCard description="Receipts and security alerts go to this address." class="w-full max-w-lg">
    <template #title>
      sam.rivera@example.com
      <Chip size="sm" variant="soft" class="ms-2 align-middle">Primary</Chip>
    </template>
    <template #action>
      <Button size="sm" variant="outline" icon-only aria-label="Email options">
        <Icon icon="gravity-ui:ellipsis" />
      </Button>
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { Button, Chip, ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
