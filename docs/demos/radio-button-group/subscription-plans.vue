<script setup lang="ts">
import { Chip, RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const memberships = [
  {
    value: 'monthly',
    title: 'Monthly',
    icon: 'gravity-ui:calendar',
    price: '€11.99',
    period: 'every month',
    billing: 'Cancel anytime',
    features: ['All courses', 'Speaking drills', 'Progress stats'],
  },
  {
    value: 'yearly',
    title: 'Yearly',
    icon: 'gravity-ui:graduation-cap',
    price: '€84',
    period: 'per year',
    billing: '€84 per year · €7 per month',
    features: ['Everything in Monthly', 'Offline lessons', 'Priority support'],
  },
  {
    value: 'family',
    title: 'Family',
    icon: 'gravity-ui:persons',
    price: '€149',
    period: 'per year',
    billing: 'Up to 4 learners',
    features: ['Everything in Yearly', 'Separate profiles', 'Shared streaks'],
  },
]
</script>

<template>
  <RadioButtonGroup
    class="w-full max-w-3xl grid-cols-1 sm:grid-cols-3"
    default-value="yearly"
    layout="grid"
    name="membership"
    aria-label="Membership"
  >
    <RadioButtonGroupItem
      v-for="plan in memberships"
      :key="plan.value"
      :value="plan.value"
      :label="plan.title"
      :description="plan.billing"
      :icon="() => h(Icon, { icon: plan.icon })"
      :indicator="false"
      :ui="{ content: 'flex-col items-start gap-3', icon: 'flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent', itemText: 'w-full gap-1' }"
    >
      <template #default="{ selected }">
        <Chip
          v-if="selected"
          aria-hidden="true"
          class="absolute end-4 top-4"
          color="accent"
          size="sm"
          variant="soft"
          label="Current plan"
        />
        <span class="mt-3 flex items-baseline gap-1">
          <span class="text-3xl font-bold">{{ plan.price }}</span>
          <span class="text-xs text-muted">{{ plan.period }}</span>
        </span>
        <span class="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          <span v-for="feature in plan.features" :key="feature" class="flex items-center gap-2 text-xs font-normal">
            <Icon icon="gravity-ui:check" class="size-3.5 shrink-0 text-accent" />
            {{ feature }}
          </span>
        </span>
      </template>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>
