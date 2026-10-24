<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { CellSelect } from '@hareui/vue'

interface ShippingMethod extends ListBoxItem {
  icon: string
}

const methods: ShippingMethod[] = [
  { value: 'courier', label: 'Courier', icon: 'gravity-ui:car' },
  { value: 'locker', label: 'Parcel locker', icon: 'gravity-ui:box' },
  { value: 'store', label: 'Store pickup', icon: 'gravity-ui:house' },
]
</script>

<template>
  <div class="w-72">
    <CellSelect default-value="courier" :items="methods" label="Shipping" :ui="{ indicator: 'hidden' }">
      <template #value="{ selectedItems, text }">
        <Icon v-if="selectedItems[0]" class="me-2 inline size-4 align-[-3px] text-accent" :icon="selectedItems[0].icon" />{{ text }}
      </template>
      <template #item-leading="{ item }">
        <Icon class="size-4" :icon="item.icon" />
      </template>
    </CellSelect>
  </div>
</template>
