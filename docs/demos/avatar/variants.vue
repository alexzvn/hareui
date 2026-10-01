<script setup lang="ts">
import { Avatar } from 'herouse'
import { Icon } from '@iconify/vue'

const colors = ['accent', 'default', 'success', 'warning', 'danger'] as const
const rows = [
  { label: 'letter', content: 'AG', icon: false, variant: 'default' as const },
  { label: 'letter soft', content: 'AG', icon: false, variant: 'soft' as const },
  { label: 'icon', content: '', icon: true, variant: 'default' as const },
  { label: 'icon soft', content: '', icon: true, variant: 'soft' as const },
]

const images = [
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=3',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=4',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=5',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=8',
  'https://img.heroui.chat/image/avatar?w=400&h=400&u=16',
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <div class="w-24 shrink-0" />
      <div v-for="color in colors" :key="color" class="flex w-20 shrink-0 items-center justify-center">
        <span class="text-xs text-muted capitalize">{{ color }}</span>
      </div>
    </div>

    <hr class="border-separator" />

    <div v-for="row in rows" :key="row.label" class="flex items-center gap-3">
      <div class="w-24 shrink-0 text-sm text-muted">{{ row.label }}</div>
      <div v-for="color in colors" :key="color" class="flex w-20 shrink-0 items-center justify-center">
        <Avatar :color="color" :variant="row.variant">
          <template #fallback>
            <Icon v-if="row.icon" icon="gravity-ui:person" />
            <template v-else>{{ row.content }}</template>
          </template>
        </Avatar>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="w-24 shrink-0 text-sm text-muted">img</div>
      <div v-for="(image, colorIndex) in images" :key="image" class="flex w-20 shrink-0 items-center justify-center">
        <Avatar :alt="`Avatar ${colors[colorIndex]}`" :color="colors[colorIndex]" :fallback="colors[colorIndex].charAt(0).toUpperCase()" :src="image" />
      </div>
    </div>
  </div>
</template>
