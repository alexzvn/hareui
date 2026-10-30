<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, Form } from '@hareui/vue'
import { h, ref } from 'vue'

import { Rating } from '@/components/rating'

const score = ref(3)
const half = ref(2.5)
const changes = ref<number[]>([])
const heart = () => h(Icon, { icon: 'gravity-ui:heart-fill' })
const starOutline = () => h(Icon, { icon: 'gravity-ui:star' })
const faces = ['face-angry', 'face-sad', 'face-neutral', 'face-smile', 'face-fun']
const submitted = ref<string | null>(null)

const onSubmit = (event: Event) => {
  event.preventDefault()
  const data = new FormData(event.currentTarget as HTMLFormElement)
  submitted.value = String(data.get('service'))
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Rating</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Default</h2>
      <Rating aria-label="Default" :default-value="3" />
      <Rating aria-label="Unrated" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">v-model</h2>
      <div class="flex flex-col gap-2">
        <Rating v-model="score" aria-label="Score" @change="changes.push($event)" />
        <p class="text-sm text-muted">value {{ score }}, changes {{ changes.join(', ') }}</p>
      </div>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Sizes</h2>
      <Rating aria-label="Small" size="sm" :default-value="4" />
      <Rating aria-label="Medium" size="md" :default-value="4" />
      <Rating aria-label="Large" size="lg" :default-value="4" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Colors</h2>
      <Rating aria-label="Warning" color="warning" :default-value="3" />
      <Rating aria-label="Accent" color="accent" :default-value="3" />
      <Rating aria-label="Success" color="success" :default-value="3" />
      <Rating aria-label="Danger" color="danger" :default-value="3" />
      <Rating aria-label="Default color" color="default" :default-value="3" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Steps</h2>
      <div class="flex flex-col gap-2">
        <Rating v-model="half" aria-label="Half" :step="0.5" hoverable />
        <p class="text-sm text-muted">{{ half }}</p>
      </div>
      <Rating aria-label="Quarter" :step="0.25" :default-value="3.75" />
      <Rating aria-label="Ten" :length="10" :default-value="7" size="sm" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">States</h2>
      <Rating aria-label="Clearable" clearable :default-value="2" />
      <Rating aria-label="Hoverable" hoverable :default-value="2" />
      <Rating aria-label="Disabled" disabled :default-value="3" />
      <Rating aria-label="Read only 3.7" readonly :default-value="3.7" />
      <Rating aria-label="Invalid" invalid error-message="Pick a score" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Orientation</h2>
      <Rating aria-label="Vertical" orientation="vertical" :default-value="2" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Icons</h2>
      <Rating aria-label="Hearts" :icon="heart" color="danger" :default-value="3" />
      <Rating aria-label="Outline" :empty-icon="starOutline" :default-value="2" />
      <Rating aria-label="Faces" :default-value="4" color="success" size="lg">
        <template #item="{ index }">
          <Icon :icon="`gravity-ui:${faces[index - 1]}`" />
        </template>
      </Rating>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Field</h2>
      <Rating label="Food quality" description="How did the meal taste?" :default-value="4" />
      <Form class="flex flex-col gap-3" @submit="onSubmit">
        <Rating
          name="service"
          label="Service"
          required
          error-message="Rate the service before sending."
        />
        <Button class="w-fit" type="submit" size="sm">Send</Button>
        <p v-if="submitted" class="text-sm text-muted">Sent: {{ submitted }}</p>
      </Form>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">:ui</h2>
      <Rating
        aria-label="Custom"
        :default-value="3"
        :ui="{ item: 'text-accent/20', fill: 'text-accent', items: 'gap-3' }"
      />
    </section>
  </div>
</template>
