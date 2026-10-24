<script setup lang="ts">
import { Label, TextArea } from '@hareui/vue'
</script>

<template>
  <div class="flex w-96 flex-col gap-4">
    <div class="flex flex-col gap-2">
      <Label for="textarea-rows-3"> Short feedback </Label>
      <TextArea
        id="textarea-rows-3"
        aria-label="Short feedback"
        placeholder="This week's highlights..."
        :rows="3"
      />
    </div>
    <div class="flex flex-col gap-2">
      <Label for="textarea-rows-6"> Detailed notes </Label>
      <TextArea
        id="textarea-rows-6"
        aria-label="Detailed notes"
        placeholder="Write out the full meeting notes..."
        :rows="6"
        :style="{ resize: 'vertical' }"
      />
    </div>
  </div>
</template>
