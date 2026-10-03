<script setup lang="ts">
import { Button, Modal } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <Modal>
    <Button variant="secondary">
      Open Modal
    </Button>
    <template #icon>
      <Icon class="text-foreground" icon="gravity-ui:rocket" />
    </template>
    <template #title>
      Welcome to HareUI
    </template>
    <template #body>
      <p>
        A beautiful, fast, and modern Vue UI library for building accessible and
        customizable web applications with ease.
      </p>
    </template>
    <template #footer="{ close }">
      <Button class="w-full" @click="close">
        Continue
      </Button>
    </template>
  </Modal>
</template>
