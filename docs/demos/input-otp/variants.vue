<template>
  <div class="flex flex-col gap-6">
    <InputOtp label="Primary variant" variant="primary" :groups="[3, 3]" />
    <InputOtp label="Secondary variant" variant="secondary" :groups="[3, 3]" />
  </div>
</template>

<script setup lang="ts">
import { InputOtp } from '@hareui/vue'
</script>
