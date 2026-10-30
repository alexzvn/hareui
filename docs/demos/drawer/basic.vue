<template>
  <Drawer :close-button="false" placement="right" title="Drawer Title">
    <Button variant="secondary"> Open Drawer </Button>
    <template #body>
      <p>
        This drawer slides in from the right edge of the screen and keeps the page behind it in
        view.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close"> Cancel </Button>
      <Button @click="close"> Confirm </Button>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Button, Drawer } from '@hareui/vue'
</script>
