<template>
  <form class="flex flex-col gap-4" @submit="handleSubmit">
    <SwitchGroup>
      <Switch name="notifications" value="on" label="Enable notifications" />
      <Switch default-value name="newsletter" value="on" label="Subscribe to newsletter" />
      <Switch name="marketing" value="on" label="Receive marketing updates" />
    </SwitchGroup>
    <Button class="mt-4" size="sm" type="submit" variant="primary"> Submit </Button>
  </form>
</template>

<script setup lang="ts">
import { Button, Switch, SwitchGroup } from '@hareui/vue'

const handleSubmit = (e: Event) => {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  alert(
    `Form submitted with:\n${Array.from(formData.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}`,
  )
}
</script>
