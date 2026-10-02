<script setup lang="ts">
import { Button, Drawer } from 'herouse'
</script>

<template>
  <Drawer :close-button="false" placement="right" title="Drawer Title">
    <Button variant="secondary">
      Open Drawer
    </Button>
    <template #body>
      <p>
        This is a bottom drawer built with Reka UI's Dialog component. It slides up from
        the bottom of the screen with a smooth CSS transition.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="secondary" @click="close">
        Cancel
      </Button>
      <Button @click="close">
        Confirm
      </Button>
    </template>
  </Drawer>
</template>
