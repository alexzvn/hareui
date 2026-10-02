<script setup lang="ts">
import { Chip, Separator } from 'herouse'
import { Icon } from '@iconify/vue'

const sizes = ['lg', 'md', 'sm'] as const
const variants = ['primary', 'secondary', 'tertiary', 'soft'] as const
const colors = ['accent', 'default', 'success', 'warning', 'danger'] as const
</script>

<template>
  <div class="flex flex-col gap-8 overflow-x-auto">
    <template v-for="(size, index) in sizes" :key="size">
      <div class="flex flex-col gap-4">
        <h3 class="text-sm font-semibold text-muted capitalize">{{ size }}</h3>
        <div class="flex items-center gap-3">
          <div class="w-24 shrink-0" />
          <div v-for="color in colors" :key="color" class="flex shrink-0 items-center justify-center" style="width: 130px">
            <span class="text-xs text-muted capitalize">{{ color }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="variant in variants" :key="variant" class="flex items-center gap-3">
            <div class="w-24 shrink-0 text-sm text-muted capitalize">{{ variant }}</div>
            <div v-for="color in colors" :key="color" class="flex shrink-0 items-center justify-center" style="width: 130px">
              <Chip :color="color" :size="size" :variant="variant">
                <template #leading><Icon height="16" icon="gravity-ui:circle-dashed" width="16" /></template>
                Label
                <template #trailing><Icon height="16" icon="gravity-ui:circle-dashed" width="16" /></template>
              </Chip>
            </div>
          </div>
        </div>
      </div>
      <Separator v-if="index < sizes.length - 1" />
    </template>
  </div>
</template>
