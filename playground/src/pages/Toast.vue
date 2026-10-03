<script setup lang="ts">
import type { ToastQueue } from '@hareui/vue'
import { Button, toast, ToastProvider, ToastQueue as ToastQueueClass } from '@hareui/vue'
import { h } from 'vue'
import { Icon } from '../icons'

const placements = ['top start', 'top', 'top end', 'bottom start', 'bottom', 'bottom end'] as const
const placementQueues = placements.map(placement => ({ placement, queue: new ToastQueueClass({ maxVisibleToasts: 3 }) as ToastQueue }))

const customQueue = new ToastQueueClass({ maxVisibleToasts: 2 }) as ToastQueue
const expandedQueue = new ToastQueueClass() as ToastQueue

function showSimple() {
  toast('Simple message')
}

function showVariants() {
  const id = toast('You have been invited to join a team', {
    action: { label: 'Dismiss', onClick: () => toast.close(id), variant: 'tertiary' },
    description: 'Bob sent you an invitation to join the team',
    indicator: h(Icon, { icon: 'gravity-ui:persons' }),
  })
  toast.success('Operation completed', { description: 'Everything went fine' })
  toast.info('New update available', { description: 'Version 2.0 is ready to install' })
  toast.warning('Please check your settings')
  toast.danger('Something went wrong')
}

function showPromise() {
  toast.promise(
    new Promise<{ count: number }>((resolve, reject) => {
      setTimeout(() => (Math.random() > 0.5 ? resolve({ count: 42 }) : reject(new Error('Failed to save data'))), 1500)
    }),
    {
      error: (error: Error) => error.message,
      loading: 'Saving…',
      success: data => `Saved ${data.count} items`,
    },
  )
}

function showExpanded() {
  expandedQueue.add({ title: 'Simple message', variant: 'default' })
  setTimeout(() => expandedQueue.add({ title: 'Operation completed', variant: 'success' }), 300)
  setTimeout(() => expandedQueue.add({ title: 'New update available', variant: 'accent' }), 600)
}

function showPersistent() {
  toast('Persistent toast', { description: 'Stays open until closed manually', timeout: 0 })
}

function showCustomQueue() {
  customQueue.add({ description: 'Custom queue, max 2 visible', title: 'Custom queue toast', variant: 'default' })
}

function showAtPlacement(queue: ToastQueue) {
  queue.add({ description: 'Event has been created', title: 'Event created', variant: 'default' })
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="text-xl font-semibold">
      Toast
    </h1>

    <ToastProvider />

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Simple
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button size="sm" variant="secondary" @click="showSimple">
          Show toast
        </Button>
        <Button size="sm" variant="secondary" @click="() => toast.success('Operation completed')">
          Success
        </Button>
        <Button size="sm" variant="secondary" @click="() => toast.info('New update available')">
          Info
        </Button>
        <Button size="sm" variant="secondary" @click="() => toast.warning('Please check your settings')">
          Warning
        </Button>
        <Button size="sm" variant="secondary" @click="() => toast.danger('Something went wrong')">
          Error
        </Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Variants, indicator, description, action
      </h2>
      <Button size="sm" variant="secondary" @click="showVariants">
        Show variants
      </Button>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Promise
      </h2>
      <Button size="sm" variant="secondary" @click="showPromise">
        Save (random success/failure)
      </Button>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Persistent (timeout: 0)
      </h2>
      <Button size="sm" variant="secondary" @click="showPersistent">
        Show persistent toast
      </Button>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Expanded stack
      </h2>
      <ToastProvider is-expanded placement="bottom start" :queue="expandedQueue" />
      <Button size="sm" variant="secondary" @click="showExpanded">
        Show 3 toasts
      </Button>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Custom queue (max 2 visible)
      </h2>
      <ToastProvider placement="top end" :queue="customQueue" />
      <Button size="sm" variant="secondary" @click="showCustomQueue">
        Add to custom queue
      </Button>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Placements
      </h2>
      <template v-for="{ placement, queue } in placementQueues" :key="placement">
        <ToastProvider :placement="placement" :queue="queue" />
      </template>
      <div class="flex flex-wrap gap-2">
        <Button v-for="{ placement, queue } in placementQueues" :key="placement" size="sm" variant="secondary" @click="showAtPlacement(queue)">
          {{ placement }}
        </Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Controls
      </h2>
      <div class="flex flex-wrap gap-4">
        <Button size="sm" variant="outline" @click="toast.clear">
          Clear all
        </Button>
        <Button size="sm" variant="outline" @click="toast.pauseAll">
          Pause all timers
        </Button>
        <Button size="sm" variant="outline" @click="toast.resumeAll">
          Resume all timers
        </Button>
      </div>
    </section>
  </div>
</template>
