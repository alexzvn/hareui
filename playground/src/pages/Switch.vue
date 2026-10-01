<script setup lang="ts">
import { Icon } from '../icons'
import { Switch } from 'herouse'
import { ref } from 'vue'

const controlled = ref(false)
const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">Switch</h1>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Sizes</h2>
      <Switch v-for="size in sizes" :key="size" :size="size" :label="size" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">States</h2>
      <Switch label="Default" />
      <Switch default-value label="Default selected" />
      <Switch disabled label="Disabled" />
      <Switch disabled default-value label="Disabled + selected" />
      <Switch required label="Required" />
      <Switch aria-label="No visible label" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Controlled</h2>
      <Switch v-model="controlled" label="Enable notifications" />
      <p class="text-sm text-muted">Switch is {{ controlled ? 'on' : 'off' }}</p>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Description</h2>
      <Switch label="Public profile" description="Allow others to see your profile information" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Slots</h2>
      <Switch default-value size="lg" aria-label="With icon">
        <template #icon="{ checked }">
          <Icon :icon="checked ? 'gravity-ui:check' : 'gravity-ui:power'" class="size-3" />
        </template>
      </Switch>
      <Switch>
        <template #label="{ checked }">
          Status: {{ checked ? 'On' : 'Off' }}
        </template>
      </Switch>
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">Label position</h2>
      <Switch label="Label after" />
      <Switch label="Label before" :ui="{ content: 'flex-row-reverse justify-end' }" />
    </section>

    <section class="flex flex-wrap items-start gap-6">
      <h2 class="w-24 text-sm text-muted">:ui override</h2>
      <Switch
        label="Success accent"
        :ui="{ control: '[--switch-control-bg-checked:var(--success)] [--switch-control-bg-checked-hover:var(--success)]' }"
        default-value
      />
    </section>
  </div>
</template>
