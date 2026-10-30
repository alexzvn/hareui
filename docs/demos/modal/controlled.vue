<template>
  <div class="flex max-w-md flex-col gap-3">
    <h3 class="text-lg font-semibold text-foreground">Controlled with v-model:open</h3>
    <p class="text-sm leading-relaxed text-pretty text-muted">
      Control the modal using Vue's <code class="text-foreground">ref</code> and
      <code class="text-foreground">v-model:open</code> for simple, external state management.
    </p>
    <div class="flex flex-col items-start gap-3 rounded-2xl bg-surface p-4 shadow-sm">
      <div class="flex w-full items-center justify-between">
        <p class="text-xs text-muted">
          Status:
          <span class="font-mono font-medium text-foreground">{{
            isOpen ? 'open' : 'closed'
          }}</span>
        </p>
      </div>
      <div class="flex gap-2">
        <Button size="sm" variant="secondary" @click="isOpen = true"> Open Modal </Button>
        <Button size="sm" variant="tertiary" @click="isOpen = !isOpen"> Toggle </Button>
      </div>
    </div>

    <Modal v-model:open="isOpen">
      <template #icon>
        <Icon class="text-accent-soft-foreground" icon="gravity-ui:circle-check" />
      </template>
      <template #title> Controlled with v-model:open </template>
      <template #body>
        <p>
          This modal is controlled by Vue's <code>ref</code>. Bind <code>v-model:open</code> to
          manage the modal state externally.
        </p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Cancel </Button>
        <Button @click="close"> Confirm </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>
