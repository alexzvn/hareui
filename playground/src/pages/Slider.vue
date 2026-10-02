<script setup lang="ts">
import { Slider } from 'herouse'
import { ref } from 'vue'

const volume = ref(25)
const range = ref([200, 600])
const committed = ref<number | number[]>()
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Slider</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Single</h2>
      <div class="flex w-80 flex-col gap-2">
        <Slider v-model="volume" label="Volume" @change-end="committed = $event" />
        <p class="text-sm text-muted">
          value {{ volume }}, change-end {{ committed }}
        </p>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Range</h2>
      <div class="flex w-80 flex-col gap-2">
        <Slider v-model="range" label="Price Range" :max="1000" :step="50" :format-options="{ style: 'currency', currency: 'USD' }" />
        <p class="text-sm text-muted">
          {{ range }}
        </p>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Disabled</h2>
      <Slider class="w-80" label="Volume" disabled :default-value="30" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Vertical</h2>
      <div class="flex h-64 gap-12">
        <Slider class="h-full" label="Volume" orientation="vertical" :default-value="30" />
        <Slider class="h-full" label="Range" orientation="vertical" :default-value="[20, 80]" />
      </div>
    </section>
  </div>
</template>
