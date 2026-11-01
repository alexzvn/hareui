<template>
  <App locale="fr-FR" :toaster="null">
    <div class="flex flex-col gap-3">
      <div class="flex items-baseline gap-4">
        <span class="w-32 text-xs text-muted">From App</span>
        <NumberValue
          class="text-xl font-semibold"
          :value="1534.75"
          format="currency"
          currency="EUR"
        />
      </div>
      <div class="flex items-baseline gap-4">
        <span class="w-32 text-xs text-muted">locale="en-GB"</span>
        <NumberValue
          class="text-xl font-semibold"
          :value="1534.75"
          format="currency"
          currency="EUR"
          locale="en-GB"
        />
      </div>
    </div>
  </App>
</template>

<script setup lang="ts">
import { App, NumberValue } from '@hareui/vue'
</script>
