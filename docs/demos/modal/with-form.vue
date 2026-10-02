<script setup lang="ts">
import { Button, Input, Modal, Surface, TextField } from 'herouse'
import { Icon } from '@iconify/vue'

const fields = [
  { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter your name' },
  { name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' },
  { name: 'phone', type: 'tel', label: 'Phone', placeholder: 'Enter your phone number' },
  { name: 'company', type: undefined, label: 'Company', placeholder: 'Enter your company name' },
  { name: 'message', type: undefined, label: 'Message', placeholder: 'Enter your message' },
]
</script>

<template>
  <Modal placement="auto" class="sm:max-w-md" :ui="{ icon: 'bg-accent-soft text-accent-soft-foreground', body: 'p-6' }">
    <Button variant="secondary">
      Open Contact Form
    </Button>
    <template #icon>
      <Icon class="size-5" icon="gravity-ui:envelope" />
    </template>
    <template #title>
      Contact Us
    </template>
    <template #description>
      <p class="mt-1.5 text-sm leading-5 text-muted">
        Fill out the form below and we'll get back to you. The modal adapts automatically
        when the keyboard appears on mobile.
      </p>
    </template>
    <template #body>
      <Surface variant="default">
        <form class="flex flex-col gap-4">
          <TextField
            v-for="field in fields"
            :key="field.name"
            class="w-full"
            :name="field.name"
            :type="field.type"
            variant="secondary"
            :label="field.label"
          >
            <Input :placeholder="field.placeholder" />
          </TextField>
        </form>
      </Surface>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close">
        Cancel
      </Button>
      <Button @click="close">
        Send Message
      </Button>
    </template>
  </Modal>
</template>
