<script setup lang="ts">
import { Checkbox, Label } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-3">
    <Checkbox id="label-marketing" />
    <Label for="label-marketing">Send me marketing emails</Label>
  </div>
</template>
