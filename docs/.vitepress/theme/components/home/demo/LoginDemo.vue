<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Avatar, Button, Card, CloseButton, Separator, themes, tv } from 'herouse'
import AppleIcon from '../icons/AppleIcon.vue'
import GoogleIcon from '../icons/GoogleIcon.vue'

const card = tv(themes.card)()
</script>

<template>
  <Card class="w-[320px] max-w-full items-start justify-center p-5" :ui="{ header: 'flex w-full items-center justify-center gap-2', content: 'w-full gap-2' }">
    <template #header>
      <Avatar>
        <template #fallback><Icon icon="gravity-ui:person" /></template>
      </Avatar>
      <h3 data-slot="card-title" :class="card.title()">Create an account</h3>
      <CloseButton class="absolute end-3 top-3" />
    </template>
    <p class="text-center text-sm font-medium text-balance text-muted">Start your free 7-day trial. No credit card required.</p>
    <Button class="w-full">Get Started</Button>
    <div class="flex w-full items-center gap-2 py-2">
      <Separator class="flex-1" />
      <p class="text-center text-xs font-medium text-muted uppercase">Or</p>
      <Separator class="flex-1" />
    </div>
    <Button class="w-full" variant="tertiary">
      <GoogleIcon />
      Continue with Google
    </Button>
    <Button class="w-full" variant="tertiary">
      <AppleIcon />
      Continue with Apple
    </Button>
  </Card>
</template>
