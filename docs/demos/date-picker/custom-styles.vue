<script setup lang="ts">
import { Calendar, DatePicker } from '@hareui/vue'
</script>

<template>
  <!--
    HeroUI's custom-styles demo restyles the embedded Calendar's own sub-parts directly. Option A's
    DatePicker has no compound parts to reach into the embedded Calendar; the `#calendar` slot
    replaces it wholesale instead — bind `value` and call `onSelect` to keep it wired to the picker.
  -->
  <DatePicker
    class="w-72"
    name="event-date"
    label="Event date"
    calendar-label="Event date"
    variant="secondary"
    :ui="{ group: 'rounded-xl border border-border/80 bg-default shadow-sm' }"
  >
    <template #calendar="{ value, onSelect }">
      <Calendar
        class="rounded-2xl bg-surface p-2"
        :ui="{ cell: 'rounded-lg [&:where([data-selected]):not([data-unavailable])]:bg-accent [&:where([data-selected]):not([data-unavailable])]:text-accent-foreground' }"
        :model-value="value"
        @update:model-value="onSelect"
      />
    </template>
  </DatePicker>
</template>
