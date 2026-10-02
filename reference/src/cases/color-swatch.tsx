import type { ReactElement } from 'react'
import { ColorSwatch } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const colors = ['#0485F7', '#EF4444', '#F59E0B', '#10B981', '#D946EF']

cases['color-swatch-basic'] = () => (
  <div className="flex items-center gap-3">
    {colors.map(color => (
      <ColorSwatch key={color} aria-label={color} color={color} />
    ))}
  </div>
)

cases['color-swatch-sizes'] = () => (
  <div className="flex items-center gap-3">
    <ColorSwatch color="#0485F7" size="xs" />
    <ColorSwatch color="#EF4444" size="sm" />
    <ColorSwatch color="#F59E0B" size="md" />
    <ColorSwatch color="#10B981" size="lg" />
    <ColorSwatch color="#D946EF" size="xl" />
  </div>
)

cases['color-swatch-shapes'] = () => (
  <div className="flex items-center gap-3">
    <ColorSwatch color="#0485F7" shape="circle" />
    <ColorSwatch color="#0485F7" shape="square" />
  </div>
)

cases['color-swatch-transparency'] = () => (
  <div className="flex items-center gap-3">
    <ColorSwatch aria-label="100% opacity" color="rgba(4, 133, 247, 1)" />
    <ColorSwatch aria-label="75% opacity" color="rgba(4, 133, 247, 0.75)" />
    <ColorSwatch aria-label="50% opacity" color="rgba(4, 133, 247, 0.5)" />
    <ColorSwatch aria-label="25% opacity" color="rgba(4, 133, 247, 0.25)" />
    <ColorSwatch aria-label="0% opacity" color="rgba(4, 133, 247, 0)" />
  </div>
)

cases['color-swatch-accessibility'] = () => (
  <div className="flex items-center gap-3">
    <ColorSwatch aria-label="Primary brand color" color="#0485F7" colorName="Ocean Blue" />
    <ColorSwatch aria-label="Error state color" color="#EF4444" colorName="Coral Red" />
    <ColorSwatch aria-label="Warning color" color="#F59E0B" colorName="Sunset Orange" />
  </div>
)
