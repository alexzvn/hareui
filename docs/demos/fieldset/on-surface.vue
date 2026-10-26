<template>
  <div class="flex items-center justify-center rounded-3xl bg-surface p-6">
    <Surface class="w-full min-w-[380px]">
      <Form @submit="onSubmit">
        <Fieldset
          class="w-full"
          legend="Profile Settings"
          description="Update your profile information."
        >
          <TextField required name="name" label="Name" :validate="validateName">
            <Input placeholder="John Doe" variant="secondary" />
          </TextField>
          <TextField required name="email" type="email" label="Email">
            <Input placeholder="john@example.com" variant="secondary" />
          </TextField>
          <TextField
            required
            name="bio"
            label="Bio"
            description="Minimum 10 characters"
            :validate="validateBio"
          >
            <TextArea placeholder="Tell us about yourself..." variant="secondary" />
          </TextField>
          <template #actions>
            <Button type="submit">
              <Icon icon="gravity-ui:floppy-disk" />
              Save changes
            </Button>
            <Button type="reset" variant="tertiary"> Cancel </Button>
          </template>
        </Fieldset>
      </Form>
    </Surface>
  </div>
</template>

<script setup lang="ts">
import { Button, Fieldset, Form, Input, Surface, TextArea, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const onSubmit = (e: Event) => {
  e.preventDefault()
  alert('Form submitted successfully!')
}

const validateName = (value: string | number) =>
  String(value).length < 3 ? 'Name must be at least 3 characters' : null

const validateBio = (value: string | number) =>
  String(value).length < 10 ? 'Bio must be at least 10 characters' : null
</script>
