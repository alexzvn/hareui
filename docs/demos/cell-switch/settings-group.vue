<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
import { computed, reactive } from 'vue'

const devices = reactive([
  { id: 'lights', name: 'Ceiling lights', on: true },
  { id: 'heating', name: 'Floor heating', on: false },
  { id: 'blinds', name: 'Blinds', on: true },
  { id: 'lock', name: 'Lock front door', on: true },
])
const onCount = computed(() => devices.filter((device) => device.on).length)
</script>

<template>
  <section class="w-[288px] rounded-2xl bg-surface-secondary p-2">
    <header class="flex items-baseline justify-between px-2 pt-1 pb-2">
      <h4 class="text-sm font-semibold">Living room</h4>
      <span class="text-xs text-muted">{{ onCount }} of {{ devices.length }} on</span>
    </header>
    <ul class="grid gap-1.5">
      <li v-for="device in devices" :key="device.id">
        <CellSwitch v-model="device.on" :label="device.name" />
      </li>
    </ul>
  </section>
</template>
