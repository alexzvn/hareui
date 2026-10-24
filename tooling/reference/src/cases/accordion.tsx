import type { ReactElement } from 'react'
import { Accordion } from '@heroui/react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

const items = [
  { id: 'a', title: 'How do I place an order?', content: 'Browse our products and proceed to checkout.' },
  { id: 'b', title: 'Can I cancel my order?', content: 'Yes, before it ships.' },
  { id: 'c', title: 'Do you ship abroad?', content: 'We ship to most countries.' },
]

type Opts = {
  variant?: 'default' | 'surface'
  expanded?: string[]
  hideSeparator?: boolean
  multiple?: boolean
  disabledId?: string
  custom?: boolean
}

const render = ({ variant, expanded, hideSeparator, multiple, disabledId, custom }: Opts = {}) => (
  <Accordion
    allowsMultipleExpanded={multiple}
    className="w-[360px]"
    defaultExpandedKeys={expanded}
    hideSeparator={hideSeparator}
    variant={variant}
  >
    {items.map(item => (
      <Accordion.Item key={item.id} id={item.id} isDisabled={item.id === disabledId}>
        <Accordion.Heading>
          <Accordion.Trigger>
            {custom ? <span className="me-3 size-4 shrink-0 text-muted">{gear()}</span> : null}
            {item.title}
            {custom
              ? (
                  <Accordion.Indicator>
                    <svg fill="currentColor" height="16" viewBox="0 0 16 16" width="16"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </Accordion.Indicator>
                )
              : <Accordion.Indicator />}
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>{item.content}</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    ))}
  </Accordion>
)

cases['accordion-default'] = () => render()
cases['accordion-expanded'] = () => render({ expanded: ['a'] })
cases['accordion-surface'] = () => render({ variant: 'surface', expanded: ['b'] })
cases['accordion-surface-last-expanded'] = () => render({ variant: 'surface', expanded: ['c'] })
cases['accordion-hide-separator'] = () => render({ hideSeparator: true })
cases['accordion-disabled'] = () => render({ disabledId: 'b' })
cases['accordion-multiple'] = () => render({ multiple: true, expanded: ['a', 'c'] })
cases['accordion-custom-indicator'] = () => render({ expanded: ['a'], custom: true })
