import type { ReactElement } from 'react'
import { Tabs } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

function TabItems({ disabledSecond, withSeparator = true }: { disabledSecond?: boolean, withSeparator?: boolean } = {}) {
  return (
    <>
      <Tabs.Tab id="overview">
        {withSeparator && <Tabs.Separator />}
        Overview
        <Tabs.Indicator />
      </Tabs.Tab>
      <Tabs.Tab isDisabled={disabledSecond} id="analytics">
        {withSeparator && <Tabs.Separator />}
        Analytics
        <Tabs.Indicator />
      </Tabs.Tab>
      <Tabs.Tab id="reports">
        {withSeparator && <Tabs.Separator />}
        Reports
        <Tabs.Indicator />
      </Tabs.Tab>
    </>
  )
}

function Panels() {
  return (
    <>
      <Tabs.Panel id="overview">
        <p>View your project overview and recent activity.</p>
      </Tabs.Panel>
      <Tabs.Panel id="analytics">
        <p>Track your metrics and analyze performance data.</p>
      </Tabs.Panel>
      <Tabs.Panel id="reports">
        <p>Generate and download detailed reports.</p>
      </Tabs.Panel>
    </>
  )
}

cases['tabs-primary'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-secondary'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview" variant="secondary">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-align-start'] = () => (
  <Tabs align="start" className="w-96" defaultSelectedKey="overview">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-align-end'] = () => (
  <Tabs align="end" className="w-96" defaultSelectedKey="overview">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-vertical'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview" orientation="vertical">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-vertical-secondary'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview" orientation="vertical" variant="secondary">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-disabled-tab'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems disabledSecond /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-selected-second'] = () => (
  <Tabs className="w-96" defaultSelectedKey="analytics">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

cases['tabs-no-separator'] = () => (
  <Tabs className="w-96" defaultSelectedKey="overview">
    <Tabs.ListContainer>
      <Tabs.List aria-label="Options"><TabItems withSeparator={false} /></Tabs.List>
    </Tabs.ListContainer>
    <Panels />
  </Tabs>
)

const overflowItems = ['Overview', 'Analytics', 'Reports', 'Performance', 'Engagement', 'Audience', 'Acquisition', 'Retention', 'Settings']

function OverflowTabs({ orientation }: { orientation?: 'vertical' }) {
  return (
    <Tabs className={orientation ? 'h-full' : undefined} orientation={orientation}>
      <Tabs.ListContainer>
        <Tabs.List aria-label="Overflow options">
          {overflowItems.map(label => (
            <Tabs.Tab key={label} id={label.toLowerCase()}>
              {label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {overflowItems.map(label => (
        <Tabs.Panel key={label} id={label.toLowerCase()}>{`${label} panel content.`}</Tabs.Panel>
      ))}
    </Tabs>
  )
}

cases['tabs-overflow'] = () => <div className="w-[400px]"><OverflowTabs /></div>
cases['tabs-overflow-vertical'] = () => <div className="h-[160px]"><OverflowTabs orientation="vertical" /></div>
