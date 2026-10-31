<template>
  <div class="flex flex-col items-start gap-3">
    <p class="text-sm text-muted">
      Status: <span class="font-mono text-foreground">{{ isOpen ? 'open' : 'closed' }}</span>
    </p>
    <Button variant="secondary" @click="isOpen = true"> Open Cart </Button>

    <Drawer v-model:open="isOpen" placement="right" title="Your cart">
      <template #body>
        <p>2 items · $148.00. Shipping is calculated at checkout.</p>
      </template>
      <template #footer="{ close }">
        <Button variant="secondary" @click="close"> Keep Shopping </Button>
        <Button @click="close"> Checkout </Button>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>
