<script setup lang="ts">
import { Label, RadioGroup } from 'herouse'
import { ref } from 'vue'

const variants = ['primary', 'secondary'] as const

const items = [
  { value: 'starter', label: 'Starter', description: 'For side projects and small teams' },
  { value: 'pro', label: 'Pro', description: 'Advanced reporting and analytics' },
  { value: 'teams', label: 'Teams', description: 'Share access with up to 10 teammates', disabled: true },
]

const controlled = ref('pro')
const picked = ref<string>()
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      RadioGroup
    </h1>

    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        {{ variant }}
      </h2>
      <RadioGroup :variant="variant" default-value="pro" name="plan" label="Plan" description="Choose a plan" :items="items" />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        horizontal
      </h2>
      <RadioGroup default-value="pro" name="plan-h" orientation="horizontal" :items="items" />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        disabled
      </h2>
      <RadioGroup disabled default-value="pro" name="plan-disabled" label="Subscription plan" :items="items" />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        required + invalid
      </h2>
      <RadioGroup
        required
        name="plan-invalid"
        label="Subscription plan"
        invalid
        error-message="Choose a plan before continuing."
        :items="items"
      />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        v-model
      </h2>
      <RadioGroup v-model="controlled" name="plan-controlled" label="Subscription plan" :items="items" />
      <p class="text-sm text-muted">
        Selected: {{ controlled }}
      </p>
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        slots
      </h2>
      <RadioGroup v-model="picked" name="plan-slots" :items="items">
        <template #label>
          Slot <em>label</em>
        </template>
        <template #description>
          Slot description
        </template>
        <template #item-label="{ item }">
          <strong>{{ item.label }}</strong>
        </template>
        <template #item-description="{ item }">
          (custom) {{ item.description }}
        </template>
        <template #indicator="{ checked }">
          <span v-if="checked" class="text-[8px] leading-none text-background">✓</span>
        </template>
      </RadioGroup>
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        :ui override
      </h2>
      <RadioGroup
        name="plan-ui"
        default-value="pro"
        label=":ui override"
        :items="items"
        :ui="{ base: 'gap-3 rounded-xl border border-border p-3', item: 'mt-0' }"
      />
    </section>

    <section class="flex flex-wrap items-start gap-10">
      <h2 class="w-24 text-sm text-muted">
        external label
      </h2>
      <div class="flex flex-col gap-1">
        <Label for="plan-ext">External label</Label>
        <RadioGroup id="plan-ext" name="plan-ext" default-value="pro" :items="items" />
      </div>
    </section>
  </div>
</template>
