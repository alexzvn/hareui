<template>
  <div class="flex h-full max-w-xl flex-col items-center justify-center">
    <div class="flex w-full flex-wrap items-center justify-center gap-4">
      <Button size="sm" variant="tertiary" @click="showDefault"> Default toast </Button>
      <Button size="sm" variant="secondary" @click="showAccent"> Accent toast </Button>
      <Button
        class="text-success-soft-foreground"
        size="sm"
        variant="tertiary"
        @click="showSuccess"
      >
        Success toast
      </Button>
      <Button
        class="text-warning-soft-foreground"
        size="sm"
        variant="tertiary"
        @click="showWarning"
      >
        Warning toast
      </Button>
      <Button size="sm" variant="danger-soft" @click="showDanger"> Danger toast </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, toast } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const showDefault = () => {
  const id = toast('You have been invited to join a team', {
    description: 'Bob sent you an invitation to join the HareUI team',
    indicator: h(Icon, { icon: 'gravity-ui:persons' }),
    variant: 'default',
    action: { label: 'Dismiss', variant: 'tertiary', onClick: () => toast.close(id) },
  })
}

const showAccent = () => {
  const id = toast.info('You have 2 credits left', {
    description: 'Get a paid plan for more credits',
    action: { label: 'Upgrade', onClick: () => toast.close(id) },
  })
}

const showSuccess = () => {
  const id = toast.success('You have upgraded your plan', {
    description: 'You can continue using HareUI Chat',
    action: {
      label: 'Billing',
      class: 'bg-success text-success-foreground',
      onClick: () => toast.close(id),
    },
  })
}

const showWarning = () => {
  const id = toast.warning('You have no credits left', {
    description: 'Upgrade to a paid plan to continue',
    action: {
      label: 'Upgrade',
      class: 'bg-warning text-warning-foreground',
      onClick: () => toast.close(id),
    },
  })
}

const showDanger = () => {
  const id = toast.danger('Storage is full', {
    description: "You've used all 15 GB. Remove files or upgrade your plan to keep uploading.",
    indicator: h(Icon, { icon: 'gravity-ui:hard-drive' }),
    action: { label: 'Remove', variant: 'danger', onClick: () => toast.close(id) },
  })
}
</script>
