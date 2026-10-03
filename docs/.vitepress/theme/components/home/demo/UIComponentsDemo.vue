<script setup lang="ts">
import { Checkbox, RadioGroup, Spinner, Switch } from '@hareui/vue'

const radios = [{ value: 'option1' }, { value: 'option2' }]
</script>

<template>
  <div class="flex w-full items-center justify-center gap-8">
    <Checkbox :default-value="true" aria-label="Checkbox Indicator Example" />
    <Switch :default-value="true" aria-label="Switch On State Example" />
    <RadioGroup
      aria-label="Radio Buttons Example"
      class="gap-8"
      default-value="option2"
      name="demo"
      orientation="horizontal"
      :items="radios"
    />
    <Spinner />
  </div>
</template>
