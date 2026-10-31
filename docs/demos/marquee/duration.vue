<template>
  <div class="flex w-full flex-col gap-6">
    <Marquee class="[--marquee-duration:8s]">
      <span
        v-for="logo in logos"
        :key="logo.name"
        class="flex shrink-0 items-center gap-2.5 text-xl font-semibold tracking-tight text-muted"
      >
        <Icon :icon="logo.icon" class="size-7" />
        {{ logo.name }}
      </span>
    </Marquee>
    <Marquee class="[--marquee-duration:40s]">
      <span
        v-for="logo in logos"
        :key="logo.name"
        class="flex shrink-0 items-center gap-2.5 text-xl font-semibold tracking-tight text-muted"
      >
        <Icon :icon="logo.icon" class="size-7" />
        {{ logo.name }}
      </span>
    </Marquee>
  </div>
</template>

<script setup lang="ts">
import { Marquee } from '@hareui/vue'
import { Icon } from '@iconify/vue'

import { logos } from './logos'
</script>
