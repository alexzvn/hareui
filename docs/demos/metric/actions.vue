<template>
  <div class="flex w-full max-w-80 flex-col gap-3">
    <Metric
      title="Active Subscribers"
      :icon="Subscribers"
      :value="1284"
      :trend="{ label: '-12', trend: 'down' }"
      :actions="actions"
      @action="last = String($event)"
    />
    <p class="text-sm text-muted">Last action: {{ last }}</p>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Metric } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const Subscribers = () => h(Icon, { icon: 'gravity-ui:persons' })

const actions: DropdownEntry[] = [
  { value: 'refresh', label: 'Refresh' },
  { value: 'export', label: 'Export CSV' },
  { value: 'hide', label: 'Hide from dashboard' },
]

const last = ref('none')
</script>
