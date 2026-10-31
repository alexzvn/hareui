<template>
  <div class="flex w-80 flex-col gap-6">
    <FormField label="Delivery" description="Pick how you want to receive the order.">
      <RadioGroup default-value="courier" name="delivery" :items="deliveryOptions" />
    </FormField>
    <FormField label="Notifications" help="We only send what you pick.">
      <Switch name="notifications" label="Email me when it ships" />
    </FormField>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { FormField, RadioGroup, Switch } from '@hareui/vue'

const deliveryOptions: RadioGroupItem[] = [
  { value: 'courier', label: 'Courier' },
  { value: 'pickup', label: 'Pick up in store' },
]
</script>
