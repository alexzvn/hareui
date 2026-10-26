<template>
  <InputOtp
    class="w-[280px]"
    label="Verify account"
    description="Code verification is currently disabled"
    disabled
    :groups="[3, 3]"
  />
</template>

<script setup lang="ts">
import { InputOtp } from '@hareui/vue'
</script>
