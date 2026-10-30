<template>
  <Meter
    class="w-64"
    :format-options="{ currency: 'USD', style: 'currency' }"
    label="Revenue"
    :max-value="1000"
    :min-value="0"
    :value="750"
  />
</template>

<script setup lang="ts">
import { Meter } from '@hareui/vue'
</script>
