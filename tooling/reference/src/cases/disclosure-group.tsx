import type { ReactElement } from 'react'
import { Disclosure, DisclosureGroup, Separator } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

type Opts = { expanded?: string[], multiple?: boolean, disabled?: boolean, separator?: boolean }

const item = (id: string, title: string, body: string) => (
  <Disclosure id={id}>
    <Disclosure.Heading>
      <Disclosure.Trigger>
        {title}
        <Disclosure.Indicator />
      </Disclosure.Trigger>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body>
        <p>{body}</p>
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)

const render = ({ expanded, multiple, disabled, separator }: Opts = {}) => (
  <DisclosureGroup allowsMultipleExpanded={multiple} className="w-[300px]" defaultExpandedKeys={expanded} isDisabled={disabled}>
    {item('one', 'First section', 'Content of the first section.')}
    {separator ? <Separator className="my-2" /> : null}
    {item('two', 'Second section', 'Content of the second section.')}
  </DisclosureGroup>
)

cases['disclosure-group-basic'] = () => render({ expanded: ['one'] })
cases['disclosure-group-multiple'] = () => render({ expanded: ['one', 'two'], multiple: true })
cases['disclosure-group-disabled'] = () => render({ expanded: ['two'], disabled: true })
cases['disclosure-group-separator'] = () => render({ expanded: ['two'], separator: true })
