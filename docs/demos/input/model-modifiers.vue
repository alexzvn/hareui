<template>
  <div class="flex w-80 flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Input v-model.trim="handle" aria-label="Handle" placeholder="  surrounded by spaces  " />
      <span class="px-1 text-sm text-muted">.trim → {{ JSON.stringify(handle) }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <Input v-model.number="seats" aria-label="Seats" placeholder="12" />
      <span class="px-1 text-sm text-muted">.number → {{ JSON.stringify(seats) }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <Input v-model.lazy="city" aria-label="City" placeholder="Updates on blur" />
      <span class="px-1 text-sm text-muted">.lazy → {{ JSON.stringify(city) }}</span>
    </div>
    <div class="flex flex-col gap-2">
      <Input v-model.nullable="nickname" aria-label="Nickname" placeholder="Clear me" />
      <span class="px-1 text-sm text-muted">.nullable → {{ JSON.stringify(nickname) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@hareui/vue'
import { ref } from 'vue'

const handle = ref('')
const seats = ref<string | number | null>(4)
const city = ref('Lisbon')
const nickname = ref<string | number | null>('Kit')
</script>
