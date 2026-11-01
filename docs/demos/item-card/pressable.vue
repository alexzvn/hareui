<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <ItemCard
      href="#billing"
      :icon="icon('credit-card')"
      title="Billing"
      description="Invoices, payment methods and tax details"
    >
      <template #action>
        <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
      </template>
    </ItemCard>
    <ItemCard
      :icon="icon('arrow-rotate-left')"
      title="Restore defaults"
      :description="isRestored ? 'Defaults restored' : 'Undo every change on this page'"
      @click="isRestored = true"
    >
      <template #action>
        <Icon icon="gravity-ui:chevron-right" class="size-4 text-muted" />
      </template>
    </ItemCard>
  </div>
</template>

<script setup lang="ts">
import { ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const isRestored = ref(false)
</script>
