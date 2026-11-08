<template>
  <div
    class="relative flex h-64 w-full max-w-md flex-col justify-between overflow-hidden rounded-2xl border border-border bg-[#e8ece4] p-4 dark:bg-[#1f2522]"
  >
    <svg
      class="absolute inset-0 size-full text-white dark:text-[#2e3732]"
      viewBox="0 0 400 256"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" stroke-linecap="round">
        <path stroke-width="14" d="M-10 70 H410 M-10 190 H410 M90 -10 V270 M290 -10 V270" />
        <path stroke-width="6" d="M-10 130 H410 M190 -10 V270 M30 -10 L150 270 M330 -10 L250 270" />
      </g>
      <path
        class="text-accent"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M90 190 V130 H290 V70"
      />
      <circle class="fill-accent" cx="90" cy="190" r="7" />
      <circle class="fill-foreground" cx="290" cy="70" r="7" />
    </svg>
    <span class="relative self-start rounded-full bg-surface px-3 py-1 text-xs shadow-sm">
      {{ status }}
    </span>
    <Sheet
      v-model:open="isOpen"
      v-model:snap-point="snap"
      :snap-points="snapPoints"
      :title="titles[snap]"
      class="mx-auto max-w-[480px]"
    >
      <Button class="relative self-center"> Choose a ride </Button>
      <template #body>
        <div class="flex flex-col gap-5">
          <div class="flex items-center gap-3">
            <Icon class="size-5 shrink-0 text-accent" icon="gravity-ui:map-pin" />
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-sm font-medium">Harbour Station → 18 Elm Street</span>
              <span class="text-xs text-muted">4.2 km · about 12 minutes</span>
            </div>
            <Button v-if="snap < 2" size="sm" variant="secondary" @click="snap = 2">
              Show all
            </Button>
          </div>
          <RadioGroup
            v-model="ride"
            name="ride"
            label="Ride type"
            variant="secondary"
            :items="rides.map(({ value, label }) => ({ value, label }))"
            :ui="{ item: 'items-stretch', content: 'w-full' }"
          >
            <template #item-label="{ index }">
              <div class="flex flex-1 items-center gap-3">
                <div class="flex min-w-0 flex-1 flex-col">
                  <span>{{ rides[index]!.label }}</span>
                  <Description>{{ rides[index]!.description }}</Description>
                </div>
                <span class="text-sm font-semibold tabular-nums">{{ rides[index]!.price }}</span>
              </div>
            </template>
          </RadioGroup>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt class="text-muted">Pickup</dt>
            <dd class="text-right">Harbour Station, gate B</dd>
            <dt class="text-muted">Arrives</dt>
            <dd class="text-right">In {{ selected.eta }} minutes</dd>
            <dt class="text-muted">Payment</dt>
            <dd class="flex items-center justify-end gap-2">
              <Icon class="size-4" icon="gravity-ui:credit-card" /> Visa ending 4021
            </dd>
          </dl>
          <Button full-width @click="confirm"> Confirm {{ selected.label }} </Button>
        </div>
      </template>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { Button, Description, RadioGroup, Sheet } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

// Index 0 shows the route, 1 the ride types, and 2 (fully expanded) the trip details.
const snapPoints = ['120px', '400px']
const titles = ['3 rides nearby', 'Choose a ride', 'Trip details']

const rides = [
  { value: 'bike', label: 'Bike', description: 'One rider · 2 min away', price: '$6.40', eta: 2 },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Up to 4 riders · 4 min away',
    price: '$11.80',
    eta: 4,
  },
  { value: 'xl', label: 'XL', description: 'Up to 6 riders · 7 min away', price: '$17.20', eta: 7 },
]

const isOpen = ref(false)
const snap = ref(0)
const ride = ref('standard')
const booked = ref<string>()

const selected = computed(() => rides.find((item) => item.value === ride.value) ?? rides[1]!)

const status = computed(() =>
  booked.value ? `${booked.value} on its way` : `Snap point ${snap.value}`,
)

const confirm = () => {
  booked.value = selected.value.label
  isOpen.value = false
  snap.value = 0
}
</script>
