import type { ToastContentValue } from 'herouse'
import type { VNode } from 'vue'
import { ToastProvider, ToastQueue } from 'herouse'
import { h } from 'vue'

// Each case gets its own queue (not the shared default) so toasts are enqueued
// synchronously before first paint, with no `open` action or timing race - the
// same pattern the React side uses.
function queueWith(...adds: Array<[ToastContentValue, { timeout?: number }?]>) {
  const queue = new ToastQueue()
  for (const [content, options] of adds) queue.add(content, { timeout: 0, ...options })
  return queue
}

const starIcon = h('svg', { 'aria-hidden': 'true', fill: 'currentColor', height: '16', viewBox: '0 0 16 16', width: '16' }, [
  h('path', { d: 'M8 1l1.9 4.6L15 6l-3.8 3.3L12.4 15 8 12.1 3.6 15l1.2-5.7L1 6l5.1-.4L8 1z' }),
])

export const cases: Record<string, () => VNode> = {}

cases['toast-default'] = () => h(ToastProvider, { queue: queueWith([{ description: 'This is a toast description', title: 'Simple message', variant: 'default' }]) })

cases['toast-accent'] = () => h(ToastProvider, { queue: queueWith([{ description: 'Version 2.0 is ready to install', title: 'New update available', variant: 'accent' }]) })

cases['toast-success'] = () => h(ToastProvider, { queue: queueWith([{ description: 'Your changes have been saved', title: 'Operation completed', variant: 'success' }]) })

cases['toast-warning'] = () => h(ToastProvider, { queue: queueWith([{ description: 'Some fields require your attention', title: 'Please check your settings', variant: 'warning' }]) })

cases['toast-danger'] = () => h(ToastProvider, { queue: queueWith([{ description: 'Please try again later', title: 'Something went wrong', variant: 'danger' }]) })

cases['toast-with-action'] = () => h(ToastProvider, {
  queue: queueWith([{
    action: { label: 'Undo', variant: 'tertiary' },
    description: 'Bob sent you an invitation to join the team',
    title: 'You have been invited to join a team',
    variant: 'default',
  }]),
})

cases['toast-custom-indicator'] = () => h(ToastProvider, { queue: queueWith([{ indicator: starIcon, title: 'Achievement unlocked', variant: 'default' }]) })

cases['toast-loading'] = () => h(ToastProvider, { queue: queueWith([{ isLoading: true, title: 'Saving…', variant: 'default' }]) })

for (const placement of ['top', 'top start', 'top end', 'bottom start', 'bottom end'] as const) {
  cases[`toast-placement-${placement.replace(' ', '-')}`] = () => h(ToastProvider, {
    placement,
    queue: queueWith([{ title: `${placement} placement`, variant: 'default' }]),
  })
}

cases['toast-stacked'] = () => h(ToastProvider, {
  queue: queueWith(
    [{ title: 'Simple message', variant: 'default' }],
    [{ title: 'Operation completed', variant: 'success' }],
    [{ title: 'New update available', variant: 'accent' }],
  ),
})

cases['toast-expanded'] = () => h(ToastProvider, {
  isExpanded: true,
  queue: queueWith(
    [{ title: 'Simple message', variant: 'default' }],
    [{ description: 'Your changes have been saved', title: 'Operation completed', variant: 'success' }],
    [{ title: 'New update available', variant: 'accent' }],
  ),
})
