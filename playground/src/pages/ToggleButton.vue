<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { ref } from 'vue'

const liked = ref(false)
const formats = ref<string[]>(['bold'])
const align = ref<string[]>(['center'])
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      ToggleButton
    </h1>
    <section class="flex flex-wrap items-center gap-3">
      <ToggleButton v-model="liked">
        {{ liked ? 'Liked' : 'Like' }}
      </ToggleButton>
      <ToggleButton variant="ghost" default-value>
        Ghost
      </ToggleButton>
      <ToggleButton size="sm">
        Small
      </ToggleButton>
      <ToggleButton size="lg" disabled>
        Disabled
      </ToggleButton>
    </section>
    <section class="flex flex-col items-start gap-3">
      <ToggleButtonGroup v-model="formats" selection-mode="multiple" separator>
        <ToggleButton value="bold">
          B
        </ToggleButton>
        <ToggleButton value="italic">
          I
        </ToggleButton>
        <ToggleButton value="underline">
          U
        </ToggleButton>
      </ToggleButtonGroup>
      <p>{{ formats.join(', ') || 'None' }}</p>
      <ToggleButtonGroup v-model="align" disallow-empty-selection separator>
        <ToggleButton value="left">
          Left
        </ToggleButton>
        <ToggleButton value="center">
          Center
        </ToggleButton>
        <ToggleButton value="right">
          Right
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup detached orientation="vertical" :ui="{ button: 'rounded-lg' }" selection-mode="multiple">
        <ToggleButton value="a">
          A
        </ToggleButton>
        <ToggleButton value="b">
          B
        </ToggleButton>
      </ToggleButtonGroup>
    </section>
  </div>
</template>
