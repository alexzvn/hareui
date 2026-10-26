<template>
  <RadioGroup
    default-value="yearly"
    name="billing"
    variant="secondary"
    label="Billing cycle"
    description="Choose how often you are charged."
    class="w-full max-w-sm gap-3 **:data-[slot=radio]:mt-0"
    :items="options.map(({ label, value }) => ({ label, value }))"
    :ui="{ content: contentClass, control: controlClass, indicator: indicatorClass }"
  >
    <template #item-label="{ index }">
      <div class="flex flex-col gap-0.5">
        <span
          class="font-medium text-foreground group-data-[selected=true]:text-success-soft-foreground"
        >
          {{ options[index]!.label }}
        </span>
        <Description class="group-data-[selected=true]:text-success-soft-foreground/80">
          {{ options[index]!.description }}
        </Description>
      </div>
    </template>
  </RadioGroup>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Description, RadioGroup } from '@hareui/vue'

const options: RadioGroupItem[] = [
  { description: '$12 billed every month', label: 'Monthly', value: 'monthly' },
  { description: '$120 billed once a year', label: 'Yearly', value: 'yearly' },
]

// HeroUI's `data-[hovered|pressed|focus-visible=true]` render-state attributes map to `hover:` / `active:` / `focus-visible:`.
const contentClass =
  'group flex w-full items-start gap-3 rounded-xl border border-success/10 bg-success-soft/30 px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-success/15 hover:bg-success-soft-hover data-[selected=true]:border-success/30 data-[selected=true]:bg-success-soft data-[selected=true]:hover:bg-success-soft-hover'

const controlClass =
  'mt-0.5 size-5 shrink-0 rounded-full border border-border bg-default shadow-none group-active/radio:scale-95 group-data-[selected=true]/radio:border-transparent group-data-[selected=true]/radio:bg-success group-data-[selected=true]/radio:group-active/radio:bg-success-hover'

const indicatorClass =
  'empty:before:rounded-full empty:before:bg-default group-data-[selected=true]/radio:empty:before:scale-50 group-data-[selected=true]/radio:empty:before:bg-success-foreground group-data-[selected=true]/radio:group-active/radio:empty:before:scale-[0.57]'
</script>
