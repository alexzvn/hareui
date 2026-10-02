<script setup lang="ts">
import { InputOtp } from 'herouse'
</script>

<template>
  <InputOtp class="w-[280px]" label="Enter code (letters only)" description="Only alphabetic characters are allowed" pattern="chars" :groups="[3, 3]" />
</template>
