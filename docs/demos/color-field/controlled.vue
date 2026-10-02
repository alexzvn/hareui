<script setup lang="ts">
import { Button, ColorField, ColorSwatch, colorToString, parseColor } from 'herouse'
import { ref } from 'vue'

const value = ref(parseColor('#0485F7'))
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorField
      v-model="value"
      class="w-[280px]"
      name="color"
      label="Color"
      :description="`Current value: ${colorToString(value, 'hex')}`"
    >
      <template #prefix>
        <ColorSwatch :color="value" size="xs" />
      </template>
    </ColorField>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = parseColor('#EF4444')">
        Set Red
      </Button>
      <Button variant="tertiary" @click="value = parseColor('#10B981')">
        Set Green
      </Button>
    </div>
  </div>
</template>
