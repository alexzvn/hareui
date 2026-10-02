<script setup lang="ts">
import { Button, Fieldset, Input, Link, TextField } from 'herouse'
import { ref } from 'vue'

const disabled = ref(false)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      Fieldset
    </h1>
    <label class="flex items-center gap-2">
      <input v-model="disabled" type="checkbox">
      Disable fieldset
    </label>
    <Fieldset class="max-w-96" legend="Profile Settings" description="Update your profile information." :disabled="disabled">
      <TextField name="name" label="Name">
        <Input placeholder="John Doe" />
      </TextField>
      <Link href="#">
        Help
      </Link>
      <template #actions>
        <Button type="submit">
          Save
        </Button>
        <Button variant="secondary">
          Cancel
        </Button>
      </template>
    </Fieldset>
    <Fieldset class="max-w-96" :ui="{ legend: 'text-lg font-semibold', actions: 'justify-end' }">
      <template #legend>
        Custom <em>legend</em>
      </template>
      <TextField name="email" label="Email">
        <Input placeholder="john@example.com" />
      </TextField>
    </Fieldset>
  </div>
</template>
