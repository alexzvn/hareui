<template>
  <RadioButtonGroup
    class="w-[min(360px,calc(100vw-2rem))]"
    default-value="borealis"
    name="meeting-room"
    variant="secondary"
    label="Meeting room"
    description="Bookings reopen after the office move on Friday."
    disabled
  >
    <RadioButtonGroupItem
      v-for="room in rooms"
      :key="room.value"
      :value="room.value"
      :label="room.title"
      :description="room.description"
    >
      <span class="mt-2 text-sm font-semibold">
        {{ room.seats }}<span class="text-xs font-normal text-muted"> seats</span>
      </span>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>

<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'

const rooms = [
  { value: 'atlas', title: 'Atlas', description: 'Ground floor, next to the kitchen', seats: 4 },
  {
    value: 'borealis',
    title: 'Borealis',
    description: 'Second floor, with a whiteboard wall',
    seats: 8,
  },
  { value: 'cosmos', title: 'Cosmos', description: 'Top floor, video conferencing kit', seats: 14 },
]
</script>
