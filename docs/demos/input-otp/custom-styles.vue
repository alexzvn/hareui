<script setup lang="ts">
import { InputOtp, Link } from '@hareui/vue'

const slotClass =
  'rounded-lg border-border/80 bg-default data-[active=true]:border-accent/40 data-[active=true]:bg-accent-soft'
</script>

<template>
  <div class="flex w-72 flex-col gap-2">
    <InputOtp
      label="Verify account"
      :groups="[3, 3]"
      :ui="{ slot: slotClass, separator: 'bg-border' }"
    />
    <Link class="text-sm text-link" href="#"> Resend code </Link>
  </div>
</template>
