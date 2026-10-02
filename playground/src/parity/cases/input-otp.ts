import type { VNode } from 'vue'
import type { InputOtpProps } from 'herouse'
import { InputOtp } from 'herouse'
import { h } from 'vue'

function otp(props: InputOtpProps & Record<string, unknown> = {}) {
  return h('div', { class: 'w-[280px]' }, [
    h(InputOtp, { groups: [3, 3], defaultValue: '', ...props }),
  ])
}

export const cases: Record<string, () => VNode> = {
  'input-otp-primary': () => otp({ label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-secondary': () => otp({ variant: 'secondary', label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-partial': () => otp({ defaultValue: '12', label: 'Verify account' }),
  'input-otp-complete': () => otp({ defaultValue: '123456', label: 'Verify account' }),
  'input-otp-four-digits': () => otp({ length: 4, groups: [4], defaultValue: '12', label: 'Verify account' }),
  'input-otp-disabled': () => otp({ defaultValue: '123', disabled: true, label: 'Verify account' }),
  'input-otp-invalid': () => otp({ invalid: true, label: 'Verify account', errorMessage: 'That code is invalid' }),
  'input-otp-required': () => otp({ required: true, label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-user-overrides': () => otp({
    label: 'Verify account',
    defaultValue: '12',
    ui: { slot: 'rounded-xl data-[active=true]:border-accent' },
  }),
}
