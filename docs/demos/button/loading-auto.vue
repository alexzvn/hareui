<template>
  <div class="flex flex-wrap items-end gap-6">
    <Button loading-auto label="Sync library" @click="sync" />

    <Form class="flex items-end gap-2" :state="state" @submit="save">
      <TextField v-model="state.project" name="project" label="Project name" />
      <Button type="submit" loading-auto variant="secondary" label="Save" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, TextField } from '@hareui/vue'
import { reactive } from 'vue'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const state = reactive({ project: 'Lighthouse' })

// The button stays pending until the returned promise settles.
const sync = () => wait(1500)

// The submit button stays pending while the form awaits this handler.
const save = () => wait(1500)
</script>
