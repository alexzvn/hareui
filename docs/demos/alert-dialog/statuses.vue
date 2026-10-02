<script setup lang="ts">
import { AlertDialog, Button } from 'herouse'

const examples = [
  {
    actions: { cancel: 'Stay Signed In', confirm: 'Sign Out' },
    body: 'You\'ll need to sign in again to access your account. Any unsaved changes will be lost.',
    classNames: 'bg-accent-soft text-accent-soft-foreground',
    header: 'Sign out of your account?',
    status: 'accent',
    trigger: 'Sign Out',
  },
  {
    actions: { cancel: 'Not Yet', confirm: 'Mark Complete' },
    body: 'This will mark the task as complete and notify all team members. The task will be moved to your completed list.',
    classNames: 'bg-success-soft text-success-soft-foreground',
    header: 'Complete this task?',
    status: 'success',
    trigger: 'Complete Task',
  },
  {
    actions: { cancel: 'Keep Editing', confirm: 'Discard' },
    body: 'You have unsaved changes that will be permanently lost. Are you sure you want to discard them?',
    classNames: 'bg-warning-soft text-warning-soft-foreground',
    header: 'Discard unsaved changes?',
    status: 'warning',
    trigger: 'Discard Changes',
  },
  {
    actions: { cancel: 'Cancel', confirm: 'Delete Account' },
    body: 'This will permanently delete your account and remove all your data from our servers. This action is irreversible.',
    classNames: 'bg-danger-soft text-danger-soft-foreground',
    header: 'Delete your account?',
    status: 'danger',
    trigger: 'Delete Account',
  },
] as const
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <AlertDialog
      v-for="example in examples"
      :key="example.status"
      class="sm:max-w-[400px]"
      :status="example.status"
      :title="example.header"
    >
      <Button :class="example.classNames">
        {{ example.trigger }}
      </Button>
      <template #body>
        <p>{{ example.body }}</p>
      </template>
      <template #footer="{ close }">
        <Button variant="tertiary" @click="close">
          {{ example.actions.cancel }}
        </Button>
        <Button :variant="example.status === 'danger' ? 'danger' : 'primary'" @click="close">
          {{ example.actions.confirm }}
        </Button>
      </template>
    </AlertDialog>
  </div>
</template>
