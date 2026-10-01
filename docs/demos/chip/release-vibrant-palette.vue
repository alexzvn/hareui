<script setup lang="ts">
import { Chip } from 'herouse'

const variants = ['primary', 'secondary', 'tertiary', 'soft'] as const
const colors = ['accent', 'default', 'success', 'warning', 'danger'] as const
const matrices = [
  { title: 'Default palette', isVibrant: false },
  { title: 'Vibrant palette', isVibrant: true },
]
</script>

<template>
  <div class="flex w-full flex-col gap-8 overflow-x-auto">
    <template v-for="(matrix, index) in matrices" :key="matrix.title">
      <hr v-if="index > 0" class="border-separator" />
      <div class="flex flex-col gap-4" :data-vibrant-palette="matrix.isVibrant ? 'true' : undefined">
        <h3 class="text-sm font-semibold text-muted">{{ matrix.title }}</h3>
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
              <Chip :color="color" :label="color" size="md" :ui="{ label: 'capitalize' }" :variant="variant" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
