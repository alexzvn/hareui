import type { ReactElement } from 'react'
import { Kbd } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'kbd-basic': () => <Kbd><Kbd.Abbr keyValue="command" /><Kbd.Content>K</Kbd.Content></Kbd>,
  'kbd-light': () => <Kbd variant="light"><Kbd.Abbr keyValue="command" /><Kbd.Content>C</Kbd.Content></Kbd>,
  'kbd-multi': () => <Kbd><Kbd.Abbr keyValue="command" /><Kbd.Abbr keyValue="shift" /><Kbd.Content>Z</Kbd.Content></Kbd>,
  'kbd-key-only': () => <Kbd><Kbd.Abbr keyValue="shift" /><Kbd.Abbr keyValue="tab" /></Kbd>,
  'kbd-content-only': () => <Kbd><Kbd.Content>Esc</Kbd.Content></Kbd>,
  'kbd-custom': () => <Kbd className="rounded-lg bg-accent-soft px-2.5 text-accent-soft-foreground"><Kbd.Abbr keyValue="command" /><Kbd.Content>K</Kbd.Content></Kbd>,
  'kbd-inline': () => <p className="text-sm">Press <Kbd><Kbd.Abbr keyValue="enter" /></Kbd> to confirm.</p>,
}
