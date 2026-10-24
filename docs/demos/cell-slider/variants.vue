<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
</script>

<template>
  <dl class="grid w-[340px] grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
    <template v-for="variant in ['default', 'secondary'] as const" :key="variant">
      <dt class="text-xs font-medium text-muted capitalize">
        {{ variant }}
      </dt>
      <dd>
        <CellSlider
          label="Layer opacity"
          :variant="variant"
          :default-value="80"
          :format-options="{ style: 'unit', unit: 'percent' }"
        />
      </dd>
    </template>
  </dl>
</template>
