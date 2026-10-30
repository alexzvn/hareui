<template>
  <div class="flex flex-col items-center gap-3">
    <Rating
      v-model="score"
      :empty-icon="StarOutline"
      :ui="{ item: 'text-muted' }"
      aria-label="Rate the delivery"
    />
    <p class="text-sm text-muted">{{ score ? `${score} of 5` : 'Tap a star to rate' }}</p>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const StarOutline = () => h(Icon, { icon: 'gravity-ui:star' })

const score = ref(0)
</script>
