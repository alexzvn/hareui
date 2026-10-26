<template>
  <form class="flex flex-col gap-4" @submit="onSubmit">
    <div class="flex flex-col gap-3">
      <Checkbox name="notifications" value="on" label="Enable notifications" />
      <Checkbox default-value name="newsletter" value="on" label="Subscribe to newsletter" />
      <Checkbox name="marketing" value="on" label="Receive marketing updates" />
    </div>
    <Button class="mt-4" size="sm" type="submit" variant="primary"> Submit </Button>
  </form>
</template>

<script setup lang="ts">
import { Button, Checkbox } from '@hareui/vue'

const onSubmit = (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  alert(
    `Form submitted with:\n${Array.from(formData.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}`,
  )
}
</script>
