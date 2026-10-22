<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="w-[360px]">
    <CellSwitch
      aria-label="Inline suggestions"
      :ui="{
        base: 'rounded-2xl bg-surface shadow-surface',
        trigger: 'h-auto gap-4 bg-transparent p-3 shadow-none',
        label: 'whitespace-normal',
      }"
    >
      <template #label>
        <span class="flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Icon icon="gravity-ui:magic-wand" class="size-5" />
          </span>
          <span class="grid min-w-0 gap-1">
            <span class="text-xs font-normal text-muted">
              Completes the current line from the open file
            </span>
            <span class="flex items-baseline gap-2 text-sm">
              Inline suggestions
              <span class="text-[11px] font-semibold tracking-wide text-accent uppercase">Beta</span>
            </span>
          </span>
        </span>
      </template>
    </CellSwitch>
  </div>
</template>
