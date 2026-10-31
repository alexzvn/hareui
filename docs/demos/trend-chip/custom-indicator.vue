<template>
  <div class="flex flex-wrap items-center gap-3">
    <TrendChip label="+9.3%">
      <template #indicator>
        <Icon icon="gravity-ui:chevrons-up" class="size-3" aria-hidden="true" />
      </template>
    </TrendChip>
    <TrendChip trend="down" label="-4.2%">
      <template #indicator>
        <Icon icon="gravity-ui:chevrons-down" class="size-3" aria-hidden="true" />
      </template>
    </TrendChip>
    <TrendChip trend="neutral" label="0.0%">
      <template #indicator>
        <Icon icon="gravity-ui:minus" class="size-3" aria-hidden="true" />
      </template>
    </TrendChip>
  </div>
</template>

<script setup lang="ts">
import { TrendChip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
