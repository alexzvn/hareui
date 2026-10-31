<template>
  <Drawer handle title="Terms & Conditions">
    <Button variant="secondary"> Terms & Conditions </Button>
    <template #body>
      <p v-for="i in 20" :key="i" class="mb-3">
        <strong class="text-foreground">{{ i }}.</strong> We may update these terms from time to
        time. When we do, we'll email you at least 30 days before the changes apply and keep the
        previous version on this page.
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
