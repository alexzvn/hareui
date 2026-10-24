<template>
  <div class="flex w-96 flex-col gap-2">
    <TextArea
      v-model="value"
      aria-describedby="textarea-controlled-description"
      aria-label="Announcement"
      placeholder="Compose an announcement..."
    />
    <Description id="textarea-controlled-description">
      Characters: {{ value.length }} / 280
    </Description>
  </div>
</template>

<script setup lang="ts">
import { Description, TextArea } from '@hareui/vue'
import { ref } from 'vue'

const value = ref('')
</script>
