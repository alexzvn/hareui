<script setup lang="ts">
import { Button, InputGroup, TextField } from 'herouse'
import { ref } from 'vue'

const visible = ref(false)
const bio = ref('')
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">InputGroup</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Prefix / suffix</h2>
      <TextField class="w-[280px]" name="website" label="Website" default-value="heroui">
        <InputGroup prefix="https://" suffix=".com" />
      </TextField>
      <TextField class="w-[280px]" name="price" label="Price" type="number" default-value="10">
        <InputGroup prefix="$" suffix="USD" />
      </TextField>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Variants</h2>
      <TextField class="w-[280px]" name="primary" label="Primary">
        <InputGroup prefix="@" placeholder="username" />
      </TextField>
      <TextField class="w-[280px]" name="secondary" label="Secondary" variant="secondary">
        <InputGroup prefix="@" placeholder="username" />
      </TextField>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">States</h2>
      <TextField class="w-[280px]" name="d" label="Disabled" disabled default-value="name@email.com">
        <InputGroup prefix="@" />
      </TextField>
      <TextField class="w-[280px]" name="i" label="Invalid" invalid error-message="Please enter a valid email">
        <InputGroup prefix="@" />
      </TextField>
      <TextField class="w-[280px]" name="r" label="Read only" readonly default-value="jane@example.com">
        <InputGroup prefix="@" />
      </TextField>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Button suffix</h2>
      <TextField class="w-[280px]" name="password" label="Password">
        <InputGroup :type="visible ? 'text' : 'password'" :ui="{ suffix: 'pe-0' }">
          <template #suffix>
            <Button icon-only size="sm" variant="ghost" :aria-label="visible ? 'Hide' : 'Show'" @click="visible = !visible">
              {{ visible ? '🙈' : '👁' }}
            </Button>
          </template>
        </InputGroup>
      </TextField>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Textarea</h2>
      <TextField v-model="bio" class="w-96" name="bio" label="Bio" :description="`${bio.length}/200`">
        <InputGroup textarea full-width :rows="4" prefix="✎" placeholder="Tell us about yourself" />
      </TextField>
    </section>
  </div>
</template>
