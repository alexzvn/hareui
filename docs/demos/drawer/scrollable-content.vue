<template>
  <Drawer handle title="Terms & Conditions">
    <Button variant="secondary"> Terms & Conditions </Button>
    <template #body>
      <p v-for="i in 20" :key="i" class="mb-3">
        Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar
        risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
        quam.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Decline </Button>
      <Button @click="close"> Accept </Button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
</script>
