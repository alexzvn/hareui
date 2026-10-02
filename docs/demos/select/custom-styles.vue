<script setup lang="ts">
import { Select } from 'herouse'

const itemClass = 'rounded-lg data-[focused=true]:bg-accent/10 data-[selected=true]:text-foreground'
const plans = [
  { value: 'free', label: 'Free', class: itemClass },
  { value: 'pro', label: 'Pro', class: itemClass },
]
</script>

<template>
  <Select
    class="w-56"
    label="Plan"
    placeholder="Pick a plan"
    variant="secondary"
    :items="plans"
    :ui="{ trigger: 'rounded-xl bg-default', popover: 'rounded-xl border border-border bg-surface p-1 shadow-lg' }"
  />
</template>
