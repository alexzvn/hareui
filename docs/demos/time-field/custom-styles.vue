<script setup lang="ts">
import { TimeField } from 'herouse'
</script>

<template>
  <!--
    HeroUI's custom-styles demo places `<Description>` above `<TimeField.Group>` via its compound
    children order; Option A's `description` prop always renders after the field's anatomy (same
    position as every other description demo), so the description sits below the group here.
  -->
  <TimeField
    class="w-full max-w-48 gap-1.5"
    name="reminder"
    description="Daily check-in notification."
    :ui="{
      group: 'rounded-xl border border-border/80 bg-surface px-2 py-1 shadow-sm ring-1 ring-accent/5 focus-within:border-accent/25 focus-within:ring-2 focus-within:ring-accent/15',
      segment: 'text-foreground',
    }"
  >
    <template #label>
      <span class="font-medium text-foreground">Reminder time</span>
    </template>
  </TimeField>
</template>
