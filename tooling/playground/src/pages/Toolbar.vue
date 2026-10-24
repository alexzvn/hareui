<script setup lang="ts">
import { Button, ButtonGroup, Separator, ToggleButton, ToggleButtonGroup, Toolbar } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      Toolbar
    </h1>
    <p class="text-sm text-muted">
      Tab into a toolbar, move with the arrow keys, Tab out and back in to return to the last control.
    </p>
    <Toolbar v-for="attached in [false, true]" :key="String(attached)" :attached="attached" aria-label="Text formatting">
      <ToggleButtonGroup selection-mode="multiple" separator>
        <ToggleButton value="bold">
          B
        </ToggleButton>
        <ToggleButton value="italic">
          I
        </ToggleButton>
        <ToggleButton value="underline" disabled>
          U
        </ToggleButton>
      </ToggleButtonGroup>
      <Separator />
      <ButtonGroup variant="tertiary" separator>
        <Button>Copy</Button>
        <Button>Cut</Button>
      </ButtonGroup>
    </Toolbar>
    <Toolbar orientation="vertical" aria-label="Tools" :ui="{ separatorHorizontal: 'w-full' }">
      <ToggleButtonGroup selection-mode="multiple" separator>
        <ToggleButton value="a">
          A
        </ToggleButton>
        <ToggleButton value="b">
          B
        </ToggleButton>
      </ToggleButtonGroup>
      <Separator />
      <ButtonGroup variant="tertiary" separator>
        <Button>Undo</Button>
        <Button>Redo</Button>
      </ButtonGroup>
    </Toolbar>
  </div>
</template>
