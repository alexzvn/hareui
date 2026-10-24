<template>
  <div class="flex flex-col gap-4">
    <TimeField
      v-model="value"
      class="w-[256px]"
      name="time"
      label="Time"
      :description="`Current value: ${value ? value.toString() : '(empty)'}`"
    />
    <div class="flex gap-2">
      <Button variant="tertiary" @click="setNow"> Set now </Button>
      <Button variant="tertiary" @click="value = null"> Clear </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, TimeField } from '@hareui/vue'
import { getLocalTimeZone, now, Time } from '@internationalized/date'
import type { TimeValue } from 'reka-ui'
import { shallowRef } from 'vue'

const value = shallowRef<TimeValue | null>(null)

function setNow() {
  const currentTime = now(getLocalTimeZone())
  value.value = new Time(currentTime.hour, currentTime.minute, currentTime.second)
}
</script>
