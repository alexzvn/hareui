<template>
  <div class="flex w-[280px] flex-col gap-2">
    <div class="flex flex-col gap-1">
      <p class="text-sm text-muted">We've sent a code to a****@gmail.com</p>
    </div>
    <InputOtp label="Verify account" :groups="[3, 3]" />
    <div class="flex items-center gap-[5px] px-1 pt-1">
      <p class="text-sm text-muted">Didn't receive a code?</p>
      <Link class="text-foreground underline" href="#"> Resend </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InputOtp, Link } from '@hareui/vue'
</script>
