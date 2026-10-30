<script setup lang="ts">
import { Surface, TextArea, TextField } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('')
const variants = ['primary', 'secondary'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">TextArea</h1>
    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-4">
      <h2 class="w-24 text-sm text-muted">{{ variant }}</h2>
      <TextArea :variant="variant" placeholder="Share a quick project update..." />
      <TextArea :variant="variant" model-value="With value" />
      <TextArea :variant="variant" disabled placeholder="Disabled" />
      <TextArea :variant="variant" invalid placeholder="Invalid" />
      <TextArea :variant="variant" readonly model-value="Read only" />
    </section>
    <section class="w-[400px]">
      <TextArea full-width placeholder="Full width" />
    </section>
    <section class="flex items-start gap-4">
      <TextArea v-model="value" aria-label="Announcement" :rows="6" :style="{ resize: 'vertical' }" placeholder="6 rows, vertical resize" />
      <span class="text-sm text-muted">Characters: {{ value.length }} / 280</span>
    </section>
    <section class="flex items-start gap-4">
      <TextField label="Message" description="Maximum 500 characters" class="w-full max-w-64" required>
        <TextArea placeholder="Write your message here..." :rows="4" />
      </TextField>
      <Surface class="rounded-3xl p-6">
        <TextArea variant="secondary" placeholder="On surface" />
      </Surface>
      <TextArea :ui="{ base: 'rounded-none font-mono' }" placeholder=":ui override" />
    </section>
  </div>
</template>
