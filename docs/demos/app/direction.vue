<template>
  <App dir="rtl" :toaster="null">
    <Slider class="w-full max-w-xs" label="Volume" :default-value="30" />
  </App>
</template>

<script setup lang="ts">
import { App, Slider } from '@hareui/vue'
</script>
