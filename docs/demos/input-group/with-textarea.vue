<template>
  <TextField
    v-model="value"
    full-width
    aria-label="Prompt input"
    class="flex w-sm flex-col sm:w-lg"
    name="prompt"
  >
    <InputGroup
      textarea
      full-width
      :rows="5"
      class="flex flex-col gap-2 rounded-3xl py-2"
      placeholder="Assign tasks or ask anything..."
      :ui="{
        prefix: 'px-3 py-0',
        input: 'w-full resize-none px-3.5 py-0',
        suffix: 'flex w-full items-center gap-1.5 px-3 py-0',
      }"
    >
      <template #prefix>
        <Button aria-label="Add context" size="sm" variant="outline">
          <Icon icon="gravity-ui:at" />
          Add Context
        </Button>
      </template>
      <template #suffix>
        <Tooltip :delay="0">
          <Button icon-only aria-label="Attach file" size="sm" variant="tertiary">
            <Icon icon="gravity-ui:plus" />
          </Button>
          <template #content>
            <p class="text-xs">Add a files and more</p>
          </template>
        </Tooltip>
        <Tooltip :delay="0">
          <Button icon-only aria-label="Connect Apps" size="sm" variant="tertiary">
            <Icon icon="gravity-ui:plug-connection" />
          </Button>
          <template #content>
            <p class="text-xs">Connect apps</p>
          </template>
        </Tooltip>
        <div class="ms-auto flex items-center gap-1.5">
          <Tooltip :delay="0">
            <Button icon-only aria-label="Voice input" size="sm" variant="ghost">
              <Icon icon="gravity-ui:microphone" />
            </Button>
            <template #content>
              <p class="text-xs">Voice input</p>
            </template>
          </Tooltip>
          <Tooltip :delay="0" class="flex items-center gap-1">
            <Button
              icon-only
              aria-label="Send prompt"
              :disabled="!value.trim()"
              :pending="isSubmitting"
              @click="handleSubmit"
            >
              <template #default="{ pending }">
                <Icon v-if="!pending" icon="gravity-ui:arrow-up" />
              </template>
            </Button>
            <template #content>
              <p class="text-xs">Send</p>
              <Kbd keys="enter" class="h-4 rounded-sm px-1" />
            </template>
          </Tooltip>
        </div>
      </template>
    </InputGroup>
  </TextField>
</template>

<script setup lang="ts">
import { Button, InputGroup, Kbd, TextField, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const value = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!value.value.trim()) return
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    value.value = ''
  }, 1000)
}
</script>
