<script setup lang="ts">
import { h, ref, useTemplateRef } from 'vue'
import { Button } from '@hareui/vue'
import { Stepper } from '@/components/stepper'
import type { StepperItem } from '@/components/stepper'
import { Icon } from '../icons'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const sizes = ['sm', 'md', 'lg'] as const
const colors = ['accent', 'success', 'warning', 'danger', 'default'] as const

const trip: StepperItem[] = [
  { title: 'Route' },
  { title: 'Lodging' },
  { title: 'Tickets' },
  { title: 'Packing' },
]

const recipe: StepperItem[] = [
  { title: 'Prep', description: 'Chop and measure', content: 'Dice the onions and weigh the flour.' },
  { title: 'Mix', description: 'Combine the dough', content: 'Fold the wet ingredients into the dry.' },
  { title: 'Bake', description: 'Into the oven', content: 'Bake at 200°C for 25 minutes.' },
  { title: 'Serve', description: 'Plate it up', content: 'Slice while warm and serve.' },
]

const withIcons: StepperItem[] = [
  { title: 'Profile', description: 'Who you are', icon: icon('person') },
  { title: 'Alerts', description: 'What to notify', icon: icon('bell') },
  { title: 'Privacy', description: 'Who can see it', icon: icon('lock') },
  { title: 'Done', description: 'All set', icon: icon('thumbs-up') },
]

const slotted: StepperItem[] = [
  { title: 'Draft', description: 'Write the post' },
  { title: 'Review', description: 'Editor pass', slot: 'review' },
  { title: 'Publish', description: 'Go live' },
]

const byValue: StepperItem[] = [
  { value: 'cart', title: 'Cart' },
  { value: 'address', title: 'Address' },
  { value: 'payment', title: 'Payment' },
]

const progress: StepperItem[] = [
  { title: 'Ordered', description: 'Mon' },
  { title: 'Shipped', description: 'Tue', progress: 0.5 },
  { title: 'Delivered', description: 'Pending' },
]

const active = ref(1)
const activeValue = ref('address')
const stepper = useTemplateRef('stepper')
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="text-xl font-semibold">Stepper</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Basic</h2>
      <Stepper :items="trip" :default-value="1" class="max-w-xl" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex max-w-xl flex-col gap-6">
        <Stepper v-for="size in sizes" :key="size" :items="trip" :size="size" :default-value="1" />
      </div>
      <div class="mt-6 grid grid-cols-3 gap-6">
        <Stepper
          v-for="size in sizes"
          :key="size"
          :items="recipe"
          :size="size"
          orientation="vertical"
          :default-value="1"
        />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Colors</h2>
      <div class="flex max-w-xl flex-col gap-6">
        <Stepper v-for="color in colors" :key="color" :items="trip" :color="color" :default-value="2" />
      </div>
      <div class="mt-6 grid grid-cols-5 gap-6">
        <Stepper
          v-for="color in colors"
          :key="color"
          :items="recipe"
          :color="color"
          orientation="vertical"
          :default-value="2"
        />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Controlled with content (v-model {{ active }})</h2>
      <Stepper ref="stepper" v-model="active" :items="recipe" class="max-w-xl" />
      <div class="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" :disabled="!stepper?.hasPrev" @click="stepper?.prev()">Back</Button>
        <Button size="sm" :disabled="!stepper?.hasNext" @click="stepper?.next()">Next</Button>
        <Button size="sm" variant="tertiary" @click="active = recipe.length">Finish all</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Vertical with content</h2>
      <Stepper :items="recipe" orientation="vertical" :default-value="0" class="max-w-xl" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Icons</h2>
      <Stepper :items="withIcons" :default-value="1" class="max-w-xl" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Item values (v-model {{ activeValue }}), non-linear</h2>
      <Stepper v-model="activeValue" :items="byValue" :linear="false" class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Partial separator progress</h2>
      <Stepper :items="progress" orientation="vertical" :default-value="1" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Disabled</h2>
      <Stepper :items="trip" disabled :default-value="2" class="max-w-xl" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots: #indicator dot, #review-title, #review-description</h2>
      <Stepper :items="slotted" :default-value="1" class="max-w-xl">
        <template #indicator="{ state }">
          <span class="size-2 rounded-full bg-current" :class="state === 'inactive' && 'opacity-60'" />
        </template>
        <template #review-title="{ item }">{{ item.title }} (2 left)</template>
        <template #review-description>Waiting on Sam</template>
      </Stepper>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Stepper
        :items="trip"
        :default-value="2"
        class="max-w-xl"
        :ui="{ root: '[--stepper-separator-size:4px]', indicator: 'rounded-md', title: 'uppercase tracking-wide' }"
      />
    </section>
  </div>
</template>
