<script setup lang="ts">
import { ColorField } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorField disabled class="w-[280px]" default-value="#0485F7" name="color" label="Color" description="This color field is disabled" />
    <ColorField disabled class="w-[280px]" name="color-empty" label="Color" placeholder="#000000" description="This color field is disabled" />
  </div>
</template>
