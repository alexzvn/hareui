<script setup lang="ts">
import { InputOtp, Label, Link } from 'herouse'
import { ref } from 'vue'

// HERO - 4320 - easter egg
const value = ref('4320')
</script>

<template>
  <div class="flex w-full justify-center">
    <div class="flex w-[280px] flex-col items-start justify-center gap-2">
      <!-- HeroUI puts the label and text above the field as separate elements, start-aligned. -->
      <div class="flex flex-col items-start gap-1">
        <Label for="home-otp">Verify account</Label>
        <p class="text-sm text-muted">We've sent a code to a****@gmail.com</p>
      </div>
      <InputOtp id="home-otp" v-model="value" :groups="[3, 3]" />
      <div class="flex items-center gap-[5px] px-1 pt-1">
        <p class="text-sm text-muted">Didn't receive a code?</p>
        <Link class="text-foreground">Resend</Link>
      </div>
    </div>
  </div>
</template>
