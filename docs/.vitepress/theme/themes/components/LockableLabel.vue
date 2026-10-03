<script setup lang="ts">
// Port of HeroUI docs `themes/components/lockable-label.tsx`.
import type { LockableThemeVariableKey } from '../constants'
import { Icon } from '@iconify/vue'
import { Button, Label, Tooltip } from '@hareui/vue'
import { ref } from 'vue'
import { useToggleLockedVariable } from '../composables/variables'

const props = defineProps<{
  label: string
  variable: LockableThemeVariableKey
  tooltip?: string
}>()

const isLabelHovered = ref(false)
const { isLocked, toggleLockedVariable } = useToggleLockedVariable(props.variable)

// HeroUI's `Tooltip.Trigger` renders this wrapper div (`.tooltip__trigger`)
const TRIGGER = 'inline-block [transition:color_150ms_var(--ease-smooth),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none focus-visible:status-focused'
</script>

<template>
  <div
    class="flex h-6 items-center gap-1"
    @mouseenter="isLabelHovered = true"
    @mouseleave="isLabelHovered = false"
  >
    <Label>{{ label }}</Label>
    <Tooltip v-if="tooltip" :delay="100" arrow>
      <div data-slot="tooltip-trigger" :class="[TRIGGER, 'hidden xl:block']">
        <Icon icon="gravity-ui:circle-info" class="size-4 text-muted" tabindex="0" />
      </div>
      <template #content>
        <p>{{ tooltip }}</p>
      </template>
    </Tooltip>
    <Tooltip :delay="100" arrow>
      <div data-slot="tooltip-trigger" :class="TRIGGER">
        <Button
          as="div"
          role="button"
          tabindex="0"
          variant="ghost"
          icon-only
          :class="['hidden size-6 rounded-full hover:flex', (isLabelHovered || isLocked) && 'flex']"
          @click="toggleLockedVariable"
        >
          <Icon :icon="isLocked ? 'gravity-ui:lock' : 'gravity-ui:lock-open'" class="size-4" />
        </Button>
      </div>
      <template #content>
        <p>{{ isLocked ? 'Unlock value' : 'Lock value' }}</p>
      </template>
    </Tooltip>
  </div>
</template>
