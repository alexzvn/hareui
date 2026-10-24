import type { ReactElement } from 'react'
import { Label, Slider } from '@heroui/react'
import { I18nProvider } from 'react-aria-components'

type Props = Omit<Parameters<typeof Slider>[0], 'children'>

function slider(props: Props = {}, label: string | null = 'Volume') {
  return (
    <Slider className="w-80" defaultValue={30} {...props}>
      {label !== null && <Label>{label}</Label>}
      <Slider.Output />
      <Slider.Track>
        {({ state }) => (
          <>
            <Slider.Fill />
            {state.values.map((_, i) => <Slider.Thumb key={i} index={i} />)}
          </>
        )}
      </Slider.Track>
    </Slider>
  )
}

export const cases: Record<string, () => ReactElement> = {
  'slider-default': () => slider(),
  'slider-zero': () => slider({ defaultValue: 0 }),
  'slider-full': () => slider({ defaultValue: 100 }),
  'slider-range': () => slider({ defaultValue: [100, 500], maxValue: 1000, step: 50, formatOptions: { currency: 'USD', style: 'currency' } }, 'Price Range'),
  'slider-range-edges': () => slider({ defaultValue: [0, 100] }, 'Range'),
  'slider-currency': () => slider({ defaultValue: 60, formatOptions: { currency: 'USD', style: 'currency' } }, 'Price'),
  'slider-disabled': () => slider({ isDisabled: true }),
  'slider-vertical': () => <div className="flex h-64 items-center justify-center">{slider({ className: 'h-full', orientation: 'vertical' })}</div>,
  'slider-no-label': () => slider({ 'aria-label': 'Volume' }, null),
  // he-IL: right-to-left with Latin digits, so the output text stays comparable
  'slider-rtl': () => <I18nProvider locale="he-IL"><div dir="rtl">{slider({ defaultValue: [20, 60], className: 'w-80 [&_[data-slot=slider-fill]]:opacity-0' }, 'Range')}</div></I18nProvider>,
}
