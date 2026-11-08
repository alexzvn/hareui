<template>
  <div class="flex w-full flex-col gap-3">
    <RichTable
      v-model:column-order="columnOrder"
      v-model:column-pinning="columnPinning"
      :data="contacts"
      :columns="columns"
      reorderable-columns
    />
    <div class="flex flex-wrap items-center gap-2">
      <Chip v-for="id in currentOrder" :key="id" size="sm" variant="soft">
        {{ labels[id] }}
      </Chip>
      <Button size="sm" variant="secondary" class="ms-auto" @click="columnOrder = []">
        Reset columns
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Button, Chip, RichTable } from '@hareui/vue'
import { computed, ref } from 'vue'

type Contact = {
  name: string
  company: string
  role: string
  email: string
  city: string
  phone: string
}

const contacts: Contact[] = [
  {
    name: 'Ines Duarte',
    company: 'Northwind',
    role: 'Designer',
    email: 'ines@northwind.dev',
    city: 'Lisbon',
    phone: '+351 21 555 0142',
  },
  {
    name: 'Tomas Berg',
    company: 'Fjord Labs',
    role: 'Engineer',
    email: 'tomas@fjordlabs.io',
    city: 'Oslo',
    phone: '+47 22 55 01 87',
  },
  {
    name: 'Amara Okafor',
    company: 'Kite & Co',
    role: 'Founder',
    email: 'amara@kite.co',
    city: 'Lagos',
    phone: '+234 1 555 0199',
  },
  {
    name: 'Yuki Tanaka',
    company: 'Lumen',
    role: 'Analyst',
    email: 'yuki@lumen.jp',
    city: 'Osaka',
    phone: '+81 6 5550 1234',
  },
]

const labels: Record<string, string> = {
  name: 'Name',
  company: 'Company',
  role: 'Role',
  email: 'Email',
  city: 'City',
  phone: 'Phone',
}

const columns: RichTableColumn<Contact>[] = Object.entries(labels).map(([key, header]) => ({
  accessorKey: key as keyof Contact,
  header,
}))

const columnOrder = ref<string[]>([])
const columnPinning = ref<{ left: string[]; right: string[] }>({ left: ['name'], right: [] })

const currentOrder = computed(() => {
  const order = columnOrder.value.length ? columnOrder.value : Object.keys(labels)
  return [
    ...columnPinning.value.left,
    ...order.filter((id) => !columnPinning.value.left.includes(id)),
  ]
})
</script>
