<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button, ButtonGroup } from 'herouse'
</script>

<template>
  <ButtonGroup separator>
    <Button class="rounded-none bg-[#08872B] hover:bg-[#0FBF3E]">
      Merge pull request
    </Button>
    <!-- stand-in: wrap in Dropdown (merge / squash / rebase items, rounded-none) once Dropdown lands -->
    <Button icon-only aria-label="Merge options" class="rounded-none bg-[#08872B] hover:bg-[#0FBF3E]">
      <Icon class="size-4" icon="gravity-ui:chevron-down" />
    </Button>
  </ButtonGroup>
</template>
