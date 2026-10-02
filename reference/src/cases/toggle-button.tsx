import type { ReactElement } from 'react'
import { ToggleButton } from '@heroui/react'

const heart = <svg aria-hidden="true" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"><circle cx={8} cy={8} r={6} /></svg>

export const cases: Record<string, () => ReactElement> = {
  'toggle-button-default': () => <ToggleButton>{heart}Like</ToggleButton>,
  'toggle-button-ghost': () => <ToggleButton variant="ghost">{heart}Like</ToggleButton>,
  'toggle-button-selected': () => <ToggleButton defaultSelected>{heart}Liked</ToggleButton>,
  'toggle-button-selected-ghost': () => <ToggleButton defaultSelected variant="ghost">{heart}Liked</ToggleButton>,
  'toggle-button-sm': () => <ToggleButton size="sm">{heart}Small</ToggleButton>,
  'toggle-button-lg': () => <ToggleButton size="lg">{heart}Large</ToggleButton>,
  'toggle-button-icon-only': () => <ToggleButton isIconOnly aria-label="Like">{heart}</ToggleButton>,
  'toggle-button-icon-only-sm': () => <ToggleButton isIconOnly aria-label="Like" size="sm">{heart}</ToggleButton>,
  'toggle-button-disabled': () => <ToggleButton defaultSelected isDisabled>{heart}Like</ToggleButton>,
  'toggle-button-custom': () => <ToggleButton defaultSelected className="h-12 rounded-lg px-6 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground">Custom</ToggleButton>,
}
