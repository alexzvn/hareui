import type { ReactElement } from 'react'
import { Button, Disclosure } from '@heroui/react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

cases['disclosure-collapsed'] = () => (
  <Disclosure className="w-[300px]">
    <Disclosure.Heading>
      <Disclosure.Trigger>
        Toggle content
        <Disclosure.Indicator />
      </Disclosure.Trigger>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body>
        <p>This disclosure is collapsed by default, revealed on click.</p>
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)

cases['disclosure-expanded'] = () => (
  <Disclosure isExpanded className="w-[300px]">
    <Disclosure.Heading>
      <Disclosure.Trigger>
        Toggle content
        <Disclosure.Indicator />
      </Disclosure.Trigger>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body>
        <p>This disclosure is expanded by default.</p>
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)

cases['disclosure-disabled'] = () => (
  <Disclosure isDisabled className="w-[300px]">
    <Disclosure.Heading>
      <Disclosure.Trigger>
        Toggle content
        <Disclosure.Indicator />
      </Disclosure.Trigger>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body>
        <p>Disabled content.</p>
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)

cases['disclosure-basic'] = () => (
  <Disclosure isExpanded className="w-full max-w-md text-center">
    <Disclosure.Heading>
      <Button slot="trigger" variant="secondary">
        <div className="size-4">{gear()}</div>
        {' Preview HeroUI Native '}
        <Disclosure.Indicator />
      </Button>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body>
        <p className="text-sm text-muted">Scan this QR code with your camera app to preview the HeroUI native components.</p>
        <div className="aspect-square w-full max-w-54 bg-surface-secondary" />
        <p className="text-sm text-muted">Expo must be installed on your device.</p>
        <Button className="mt-4" variant="primary">Download on App Store</Button>
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)

cases['disclosure-custom-trigger'] = () => (
  <Disclosure className="w-full max-w-sm">
    <Disclosure.Heading>
      <Button
        className="w-full justify-between rounded-xl border border-border/70 bg-linear-to-b from-neutral-50/90 to-white px-4 py-3 font-medium text-foreground shadow-sm ring-1 ring-black/5 hover:bg-muted/30 dark:from-neutral-900/80 dark:to-neutral-900 dark:ring-white/10"
        slot="trigger"
        variant="ghost"
      >
        <span className="flex items-center gap-2">
          <div className="size-4 text-muted">{gear()}</div>
          Shipping details
        </span>
        <Disclosure.Indicator className="text-muted" />
      </Button>
    </Disclosure.Heading>
    <Disclosure.Content>
      <Disclosure.Body className="mt-2 rounded-xl border border-border/70 bg-surface/50 p-4 text-sm leading-relaxed text-muted dark:bg-neutral-900/50">
        Orders ship within 2 business days. Standard delivery takes 3–5 days; express is available at checkout.
      </Disclosure.Body>
    </Disclosure.Content>
  </Disclosure>
)
