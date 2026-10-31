<template>
  <FormField
    label="Team"
    hint="Optional"
    help="You can change teams later in settings."
    class="w-80"
  >
    <Input placeholder="Design systems" full-width />
  </FormField>
</template>

<script setup lang="ts">
import { FormField, Input } from '@hareui/vue'
</script>
