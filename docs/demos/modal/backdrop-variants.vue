<script setup lang="ts">
import { Button, Modal } from 'herouse'
import { Icon } from '@iconify/vue'

const variants = ['opaque', 'blur', 'transparent'] as const
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Modal v-for="variant in variants" :key="variant" :variant="variant">
      <Button variant="secondary">
        {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
      </Button>
      <template #icon>
        <Icon class="text-foreground" icon="gravity-ui:rocket" />
      </template>
      <template #title>
        Backdrop: {{ variant.charAt(0).toUpperCase() + variant.slice(1) }}
      </template>
      <template #body>
        <p>
          This modal uses the <code>{{ variant }}</code> backdrop variant. Compare the
          different visual effects: opaque provides full opacity, blur adds a backdrop
          filter, and transparent removes the background.
        </p>
      </template>
      <template #footer="{ close }">
        <Button class="w-full" @click="close">
          Continue
        </Button>
      </template>
    </Modal>
  </div>
</template>
