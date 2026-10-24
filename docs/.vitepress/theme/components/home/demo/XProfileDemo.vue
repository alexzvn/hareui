<script setup lang="ts">
import { Avatar, Card } from '@hareui/vue'

import HareLogo from '../../HareLogo.vue'
import VerifiedBadgeIcon from '../icons/VerifiedBadgeIcon.vue'
</script>

<template>
  <Card
    class="w-full items-start justify-center xl:w-[400px]"
    :ui="{
      header: 'items-top w-full flex-row justify-between',
      content: 'flex-row text-start',
      footer: 'gap-2',
    }"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <Avatar size="sm">
          <template #fallback>
            <HareLogo class="size-5" />
          </template>
        </Avatar>
        <div class="flex h-full flex-col items-start justify-center">
          <div class="flex items-center gap-0.5">
            <span class="text-sm leading-4 font-semibold">HareUI</span>
            <VerifiedBadgeIcon height="18" width="18" />
          </div>
          <span class="text-sm tracking-tight text-muted">@HareUI</span>
        </div>
      </div>
    </template>
    <p class="ps-px text-sm font-medium">
      Building the future of UI for Vue.&nbsp;
      <br />
      <!-- One line: JSX drops the newline between the emoji and `&nbsp;`, Vue would render it as a space. -->
      <span aria-label="rocket" role="img">🚀</span>&nbsp;A Vue port of HeroUI v3&nbsp;
    </p>
    <template #footer>
      <div class="flex gap-1">
        <p class="text-sm font-semibold">4</p>
        <p class="text-sm text-muted">Following</p>
      </div>
      <div class="flex gap-1">
        <p class="text-sm font-semibold">97.1K</p>
        <p class="text-sm text-muted">Followers</p>
      </div>
    </template>
  </Card>
</template>
