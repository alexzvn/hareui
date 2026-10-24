<script setup lang="ts">
import { Button, ButtonGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="w-[400px] space-y-3">
    <ButtonGroup full-width separator>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
    <ButtonGroup full-width separator>
      <Button icon-only aria-label="Align left">
        <Icon icon="gravity-ui:text-align-left" />
      </Button>
      <Button icon-only aria-label="Align center">
        <Icon icon="gravity-ui:text-align-center" />
      </Button>
      <Button icon-only aria-label="Align right">
        <Icon icon="gravity-ui:text-align-right" />
      </Button>
    </ButtonGroup>
  </div>
</template>
