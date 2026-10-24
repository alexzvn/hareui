<script setup lang="ts">
import { AlertDialog, Button } from '@hareui/vue'

// HeroUI draws the top glow and hairline with two absolutely positioned `aria-hidden` divs in the
// dialog; the props API has no slot before the header, so they are the dialog's ::before/::after.
const dialogClass = [
  'relative overflow-hidden border border-border/80 bg-surface shadow-2xl ring-1 ring-accent/10 sm:max-w-[400px] dark:border-border/90 dark:bg-surface dark:ring-accent/15',
  'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-linear-to-b before:from-accent/6 before:to-transparent dark:before:from-accent/10',
  'after:pointer-events-none after:absolute after:inset-x-8 after:top-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-accent/35 after:to-transparent dark:after:via-accent/45',
].join(' ')
</script>

<template>
  <AlertDialog
    :class="dialogClass"
    :close-button="false"
    status="accent"
    title="Sign out of your account?"
    variant="blur"
    :ui="{ backdrop: 'bg-overlay/50 dark:bg-overlay/60', header: 'relative', body: 'relative' }"
  >
    <Button variant="secondary"> Sign out </Button>
    <template #body>
      <p class="text-muted">
        You will be signed out on this device. Unsaved work in
        <strong class="text-foreground">Acme Workspace</strong> may be lost unless it was saved to
        the cloud.
      </p>
    </template>
    <template #footer="{ close }">
      <Button variant="tertiary" @click="close"> Stay signed in </Button>
      <Button @click="close"> Sign out </Button>
    </template>
  </AlertDialog>
</template>
