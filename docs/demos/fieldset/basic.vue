<template>
  <Form class="w-full max-w-96" @submit="onSubmit">
    <Fieldset legend="Profile Settings" description="Update your profile information.">
      <TextField required name="name" label="Name" :validate="validateName">
        <Input placeholder="John Doe" />
      </TextField>
      <TextField required name="email" type="email" label="Email">
        <Input placeholder="john@example.com" />
      </TextField>
      <TextField
        required
        name="bio"
        label="Bio"
        description="Minimum 10 characters"
        :validate="validateBio"
      >
        <TextArea placeholder="Tell us about yourself..." />
      </TextField>
      <template #actions>
        <Button type="submit">
          <Icon icon="gravity-ui:floppy-disk" />
          Save changes
        </Button>
        <Button type="reset" variant="secondary"> Cancel </Button>
      </template>
    </Fieldset>
  </Form>
</template>

<script setup lang="ts">
import { Button, Fieldset, Form, Input, TextArea, TextField } from '@hareui/vue'
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
