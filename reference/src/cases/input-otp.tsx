import type { ReactElement } from 'react'
import { Description, InputOTP, Label } from '@heroui/react'
import { Fragment } from 'react'

type Props = Parameters<typeof InputOTP>[0]

function otp(props: Omit<Props, 'children'> = {}, groupSizes: number[] = [3, 3], head?: { label?: string, description?: string }, error?: string, slotClassName?: string) {
  let index = 0
  const groups = groupSizes.map(size => Array.from({ length: size }, () => index++))

  return (
    <div className="flex w-[280px] flex-col gap-1">
      {/* HareUI's built-in label mirrors the field state, as HeroUI's disabled demo does with `<Label isDisabled>` */}
      {head?.label ? <Label isDisabled={props.isDisabled} isInvalid={props.isInvalid} isRequired={props.isRequired ?? props.required}>{head.label}</Label> : null}
      <InputOTP maxLength={groupSizes.reduce((a, b) => a + b, 0)} {...props}>
        {groups.map((indexes, groupIndex) => (
          <Fragment key={groupIndex}>
            <InputOTP.Group>
              {indexes.map(i => <InputOTP.Slot key={i} className={slotClassName} index={i} />)}
            </InputOTP.Group>
            {groupIndex < groups.length - 1 ? <InputOTP.Separator /> : null}
          </Fragment>
        ))}
      </InputOTP>
      {head?.description ? <Description>{head.description}</Description> : null}
      {/* RAC's FieldError renders nothing outside a field context; HeroUI's with-validation demo uses this span */}
      {error ? <span className="field-error" data-slot="field-error" data-visible="true">{error}</span> : null}
    </div>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'input-otp-primary': () => otp({}, [3, 3], { label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-secondary': () => otp({ variant: 'secondary' }, [3, 3], { label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-partial': () => otp({ defaultValue: '12' }, [3, 3], { label: 'Verify account' }),
  'input-otp-complete': () => otp({ defaultValue: '123456' }, [3, 3], { label: 'Verify account' }),
  'input-otp-four-digits': () => otp({ defaultValue: '12' }, [4], { label: 'Verify account' }),
  'input-otp-disabled': () => otp({ defaultValue: '123', isDisabled: true }, [3, 3], { label: 'Verify account' }),
  'input-otp-invalid': () => otp({ isInvalid: true }, [3, 3], { label: 'Verify account' }, 'That code is invalid'),
  'input-otp-required': () => otp({ required: true }, [3, 3], { label: 'Verify account', description: 'Enter the 6-digit code we emailed you' }),
  'input-otp-user-overrides': () => otp({ defaultValue: '12' }, [3, 3], { label: 'Verify account' }, undefined, 'rounded-xl data-[active=true]:border-accent'),
}
