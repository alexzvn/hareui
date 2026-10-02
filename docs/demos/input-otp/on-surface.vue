<script setup lang="ts">
import { InputOtp, Link, Surface } from 'herouse'
</script>

<template>
  <Surface class="flex w-full flex-col gap-2 rounded-3xl p-6">
    <p class="text-sm text-muted">We've sent a code to a****@gmail.com</p>
    <InputOtp label="Verify account" variant="secondary" :groups="[3, 3]" />
    <div class="flex items-center gap-[5px] px-1 pt-1">
      <p class="text-sm text-muted">Didn't receive a code?</p>
      <Link class="text-foreground underline" href="#">
        Resend
      </Link>
    </div>
  </Surface>
</template>
