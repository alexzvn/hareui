<script setup lang="ts">
import { InputOtp } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <div class="flex w-[280px] flex-col gap-2">
    <InputOtp v-model="value" label="Verify account" :groups="[3, 3]" />
    <p class="text-sm text-muted">
      <template v-if="value.length > 0">
        Value: {{ value }} ({{ value.length }}/6) &bull;
        <button class="font-medium text-foreground underline" type="button" @click="value = ''">
          Clear
        </button>
      </template>
      <template v-else>
        Enter a 6-digit code
      </template>
    </p>
  </div>
</template>
