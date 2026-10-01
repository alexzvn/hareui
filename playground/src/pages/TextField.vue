<script setup lang="ts">
import { Input, Label, TextField } from 'herouse'
import { computed, ref } from 'vue'

const username = ref('')
const invalid = computed(() => username.value.length > 0 && username.value.length < 3)
const variants = ['primary', 'secondary'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">TextField</h1>
    <section v-for="variant in variants" :key="variant" class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">{{ variant }}</h2>
      <TextField :variant="variant" label="Email" placeholder="john@example.com" description="We'll never share your email." />
      <TextField :variant="variant" required label="Required" placeholder="John Doe" description="This field is required" />
      <TextField :variant="variant" disabled label="Disabled" model-value="USR-12345" description="This field cannot be edited" />
      <TextField :variant="variant" invalid label="Invalid" description="Hidden while invalid" error-message="Please enter a valid email address" />
    </section>
    <section class="w-[400px]">
      <TextField full-width label="Full width" placeholder="John" />
    </section>
    <section class="flex items-start gap-6">
      <TextField
        v-model="username"
        required
        :invalid="invalid"
        label="Validation"
        placeholder="jane_doe"
        description="At least 3 characters."
        error-message="Username must be at least 3 characters."
      />
      <TextField>
        <template #label>Slot <em>label</em></template>
        <template #default="{ id }">
          <Input :id="id" variant="secondary" placeholder="Custom input in default slot" />
        </template>
        <template #description>Slot description</template>
      </TextField>
      <TextField label=":ui override" :ui="{ base: 'gap-3 rounded-xl border border-border p-3' }" placeholder="…" />
    </section>
    <section>
      <TextField>
        <template #default="{ id }">
          <Label :for="id">Manual composition</Label>
          <Input placeholder="Reads id from context" />
        </template>
      </TextField>
    </section>
  </div>
</template>
