<template>
  <ItemCard :icon="icon('globe')" title="Language and region" class="w-full max-w-md">
    <template #action>
      <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })
</script>
