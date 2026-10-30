<template>
  <Accordion
    class="bg-surface-1/10 w-full max-w-md rounded-2xl"
    :items="items"
    :ui="ui"
    variant="surface"
  >
    <template #leading="{ item }">
      <span
        class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground transition-[scale,rotate] duration-300 ease-out group-hover/item:scale-120 group-hover/item:-rotate-10 group-hover/item:drop-shadow-lg"
      >
        <Icon class="size-5" :icon="item.icon" />
      </span>
    </template>
    <template #label="{ item }">
      <div class="flex flex-col gap-0">
        <span class="leading-5 font-medium">{{ item.label }}</span>
        <span class="leading-6 font-normal text-muted/80">{{ item.subtitle }}</span>
      </div>
    </template>
    <template #indicator>
      <Icon height="16" icon="gravity-ui:chevron-down" width="16" />
    </template>
  </Accordion>
</template>

<script setup lang="ts">
import type { AccordionItem } from '@hareui/vue'
import { Accordion } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type SetupItem = {
  icon: string
  subtitle: string
} & AccordionItem

const items: SetupItem[] = [
  {
    content: 'Choose which updates reach you by email and which only show up in the app.',
    icon: 'gravity-ui:bell',
    subtitle: 'Pick what you hear about',
    label: 'Alerts',
  },
  {
    content: 'Add a second sign-in step with an authenticator app or a hardware key.',
    icon: 'gravity-ui:shield-check',
    subtitle: 'Protect your account',
    label: 'Two-Step Sign-In',
  },
  {
    content: 'Invite teammates by email and decide what each of them can edit.',
    icon: 'gravity-ui:persons',
    subtitle: 'Work together',
    label: 'Team Members',
  },
]

const ui = {
  item: "group/item first:**:data-[slot=accordion-trigger]:rounded-t-2xl last:[&:not(:has([data-slot=accordion-trigger][aria-expanded='true']))_[data-slot=accordion-trigger]]:rounded-b-2xl",
  trigger: 'group flex items-center gap-2 transition-none hover:bg-surface',
  indicator: 'text-muted/50 [&>svg]:size-4',
  bodyInner: 'text-muted/80',
}
</script>
