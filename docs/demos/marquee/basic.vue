<template>
  <Marquee class="w-full">
    <span
      v-for="logo in logos"
      :key="logo.name"
      class="flex shrink-0 items-center gap-2.5 text-xl font-semibold tracking-tight text-muted"
    >
      <Icon :icon="logo.icon" class="size-7" />
      {{ logo.name }}
    </span>
  </Marquee>
</template>

<script setup lang="ts">
import { Marquee } from '@hareui/vue'
import { Icon } from '@iconify/vue'

import { logos } from './logos'
</script>
