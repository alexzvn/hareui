<template>
  <form class="flex w-[300px] flex-col gap-4" @submit="onSubmit">
    <NativeSelect
      required
      full-width
      label="From"
      name="origin"
      placeholder="Departure airport"
      :items="airports"
    />
    <NativeSelect
      required
      full-width
      label="Cabin"
      name="cabin"
      placeholder="Choose a cabin"
      description="Upgrades depend on seat availability"
      :items="cabins"
    />
    <Button size="lg" type="submit"> Search flights </Button>
  </form>
</template>

<script setup lang="ts">
import { Button, NativeSelect } from '@hareui/vue'

const airports = [
  {
    label: 'Europe',
    items: [
      { value: 'LIS', label: 'Lisbon (LIS)' },
      { value: 'BER', label: 'Berlin (BER)' },
      { value: 'FCO', label: 'Rome (FCO)' },
    ],
  },
  {
    label: 'Americas',
    items: [
      { value: 'YVR', label: 'Vancouver (YVR)' },
      { value: 'BOS', label: 'Boston (BOS)' },
      { value: 'GRU', label: 'São Paulo (GRU)' },
    ],
  },
  {
    label: 'Asia-Pacific',
    items: [
      { value: 'SIN', label: 'Singapore (SIN)' },
      { value: 'ICN', label: 'Seoul (ICN)' },
      { value: 'AKL', label: 'Auckland (AKL)' },
    ],
  },
]
const cabins = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium economy' },
  { value: 'business', label: 'Business' },
]

const onSubmit = (event: Event) => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(event.target as HTMLFormElement))
  alert(`Searching flights: ${JSON.stringify(data)}`)
}
</script>
