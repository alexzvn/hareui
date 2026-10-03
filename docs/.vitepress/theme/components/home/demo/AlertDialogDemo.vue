<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Avatar, Button, Card, CloseButton, themes, tv } from '@hareui/vue'

const card = tv(themes.card)()
</script>

<template>
  <Card
    class="h-[208px] w-full items-start justify-center p-5 min-[1200px]:w-[340px]"
    :ui="{ header: 'flex w-full items-start justify-center gap-2 px-1', footer: 'flex w-full items-center gap-2 px-0.5 pt-3' }"
  >
    <template #header>
      <Avatar color="warning" variant="soft">
        <template #fallback><Icon class="text-lg" icon="gravity-ui:floppy-disk" /></template>
      </Avatar>
      <h3 data-slot="card-title" :class="card.title()">Unsaved changes</h3>
      <p data-slot="card-description" :class="card.description()">Do you want to save or discard changes?</p>
      <CloseButton class="absolute end-3 top-3" />
    </template>
    <template #footer>
      <Button class="w-full" variant="tertiary">Discard</Button>
      <Button class="w-full">Save changes</Button>
    </template>
  </Card>
</template>
