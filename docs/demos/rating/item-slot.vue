<template>
  <div class="flex flex-col items-center gap-3">
    <Rating
      v-model="mood"
      size="lg"
      color="success"
      aria-label="How was your day?"
      :item-label="(value) => moods[value - 1]!.label"
    >
      <template #item="{ index }">
        <Icon :icon="moods[index - 1]!.icon" />
      </template>
    </Rating>
    <p class="text-sm text-muted">{{ mood ? moods[mood - 1]!.label : 'How was your day?' }}</p>
  </div>
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const moods = [
  { icon: 'gravity-ui:face-angry', label: 'Rough' },
  { icon: 'gravity-ui:face-sad', label: 'Meh' },
  { icon: 'gravity-ui:face-neutral', label: 'Okay' },
  { icon: 'gravity-ui:face-smile', label: 'Good' },
  { icon: 'gravity-ui:face-fun', label: 'Great' },
]

const mood = ref(4)
</script>
