<script setup lang="ts">
import { TextArea, TextField } from 'herouse'
</script>

<template>
  <TextField class="w-full max-w-64" name="message" label="Message" description="Maximum 500 characters">
    <TextArea placeholder="Write your message here..." :rows="4" />
  </TextField>
</template>
