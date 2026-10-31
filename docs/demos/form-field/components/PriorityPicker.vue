<template>
  <div
    role="radiogroup"
    :aria-labelledby="labelId"
    v-bind="ariaAttrs"
    class="flex gap-2"
    @keydown="onKeydown"
  >
    <button
      v-for="(level, index) in levels"
      :key="level"
      ref="buttons"
      type="button"
      role="radio"
      :aria-checked="model === index"
      :tabindex="model === index ? 0 : -1"
      :class="[
        'rounded-full border px-3 py-1 text-sm focus-visible:status-focused',
        model === index ? 'border-accent bg-accent text-accent-foreground' : 'border-border',
      ]"
      @click="select(index)"
    >
      {{ level }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useFormField } from '@hareui/vue'
import { useTemplateRef } from 'vue'

const model = defineModel<number>({ default: 0 })

// A radiogroup can't be a `<label>` target, so it's named through `labelId` instead
const { labelId, ariaAttrs, emitFormChange } = useFormField({ labelTarget: () => undefined })

const levels = ['Low', 'Medium', 'High']
const buttons = useTemplateRef<HTMLButtonElement[]>('buttons')

const select = (index: number) => {
  model.value = index
  emitFormChange()
}

// Arrow keys move the selection and focus, like native radio buttons
const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

const onKeydown = (event: KeyboardEvent) => {
  const step = steps[event.key]
  if (!step) return

  event.preventDefault()
  const index = (model.value + step + levels.length) % levels.length
  select(index)
  buttons.value?.[index]?.focus()
}
</script>
