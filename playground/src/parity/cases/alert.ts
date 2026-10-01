import type { VNode } from 'vue'
import { Alert, Button, CloseButton, Spinner } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const title = 'New features available'
const description = 'Check out our latest updates including dark mode support and improved accessibility features.'

for (const status of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`alert-${status}`] = () => h(Alert, { status, class: 'w-[480px]', title, description })

cases['alert-title-only'] = () => h(Alert, { status: 'success', class: 'w-[480px]', title: 'Profile updated successfully' }, {
  trailing: () => h(CloseButton),
})
cases['alert-custom-indicator'] = () => h(Alert, { status: 'accent', class: 'w-[480px]', title: 'Processing your request', description: 'Please wait while we sync your data.' }, {
  indicator: () => h(Spinner, { size: 'sm' }),
})
cases['alert-actions'] = () => h(Alert, { status: 'danger', class: 'w-[480px]', title: 'Unable to connect to server', description: 'We\'re experiencing connection issues.' }, {
  default: () => h(Button, { class: 'mt-2', size: 'sm', variant: 'danger' }, () => 'Retry'),
  trailing: () => h(Button, { size: 'sm', variant: 'danger' }, () => 'Retry'),
})
cases['alert-no-indicator'] = () => h(Alert, { class: 'w-[480px]', indicator: false, title, description })
cases['alert-ui-override'] = () => h(Alert, {
  status: 'warning',
  class: 'w-[480px] rounded-xl border border-warning/20 shadow-sm',
  ui: { indicator: 'text-warning', title: 'text-base', description: 'text-xs' },
  title,
  description,
})
