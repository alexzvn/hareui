<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, Fieldset, Form, Input, TextArea, TextField } from 'herouse'

function onSubmit(e: Event) {
  e.preventDefault()
  alert('Form submitted successfully!')
}

const validateName = (value: string | number) => String(value).length < 3 ? 'Name must be at least 3 characters' : null
const validateBio = (value: string | number) => String(value).length < 10 ? 'Bio must be at least 10 characters' : null

const shell = 'rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white p-4 ring-1 ring-black/5 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10'
const field = 'rounded-xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/5 transition-[box-shadow,border-color] focus-visible:ring-2 focus-visible:ring-neutral-400/25 dark:ring-white/10 dark:focus-visible:ring-neutral-500/30'
</script>

<template>
  <Form class="w-full max-w-96" @submit="onSubmit">
    <Fieldset
      :class="shell"
      legend="Profile Settings"
      description="Update your profile information."
      :ui="{ legend: 'font-medium text-neutral-800 dark:text-neutral-100', description: 'text-neutral-600 dark:text-neutral-400' }"
    >
      <TextField required name="name" label="Name" :validate="validateName">
        <Input :class="field" placeholder="John Doe" />
      </TextField>
      <TextField required name="email" type="email" label="Email">
        <Input :class="field" placeholder="john@example.com" />
      </TextField>
      <TextField required name="bio" label="Bio" description="Minimum 10 characters" :validate="validateBio">
        <TextArea :class="field" placeholder="Tell us about yourself..." />
      </TextField>
    <template #actions>
      <Button type="submit">
        <Icon icon="gravity-ui:floppy-disk" />
        Save changes
      </Button>
      <Button type="reset" variant="secondary">
        Cancel
      </Button>
    </template>
    </Fieldset>
  </Form>
</template>
