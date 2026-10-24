<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
</script>

<template>
  <Drawer :close-button="false" :dismissible="false" title="Confirm Action">
    <Button variant="secondary"> Important Action </Button>
    <template #body>
      <p>
        This drawer cannot be dismissed by clicking outside or dragging. You must use one of the
        buttons below.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Cancel </Button>
      <Button @click="close"> Confirm </Button>
    </template>
  </Drawer>
</template>
