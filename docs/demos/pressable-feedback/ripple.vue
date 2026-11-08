<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap gap-3">
      <PressableFeedback :as="Button" ripple>
        <Icon icon="gravity-ui:paper-plane" />
        Send
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="secondary" ripple>
        <Icon icon="gravity-ui:person-plus" />
        Invite
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="tertiary" ripple>
        <Icon icon="gravity-ui:bookmark" />
        Save for later
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="danger-soft" ripple>
        <Icon icon="gravity-ui:trash-bin" />
        Delete
      </PressableFeedback>
    </div>

    <div class="flex gap-3">
      <PressableFeedback :as="Button" variant="tertiary" icon-only ripple aria-label="More">
        <Icon icon="gravity-ui:ellipsis" />
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="secondary" icon-only ripple aria-label="Settings">
        <Icon icon="gravity-ui:gear" />
      </PressableFeedback>
      <PressableFeedback :as="Button" variant="danger" icon-only ripple aria-label="Delete">
        <Icon icon="gravity-ui:trash-bin" />
      </PressableFeedback>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
