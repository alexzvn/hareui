import type { ReactElement } from 'react'
import { ColorField, ColorSwatch, Description, FieldError, Label, parseColor } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

cases['color-field-default'] = () => (
  <ColorField className="w-[280px]" defaultValue={parseColor('#0485F7')} name="color">
    <Label>Color</Label>
    <ColorField.Group>
      <ColorField.Prefix>
        <ColorSwatch color="#0485F7" size="xs" />
      </ColorField.Prefix>
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)

cases['color-field-focus'] = () => (
  <ColorField className="w-[280px]" defaultValue={parseColor('#0485F7')} name="color">
    <Label>Color</Label>
    <ColorField.Group>
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)

const secondary = () => (
  <ColorField className="w-[280px]" defaultValue={parseColor('#F43F5E')} name="secondary-color">
    <Label>Secondary variant</Label>
    <ColorField.Group variant="secondary">
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)
cases['color-field-secondary'] = secondary
cases['color-field-secondary-focus'] = secondary

cases['color-field-required'] = () => (
  <ColorField isRequired className="w-[280px]" name="color">
    <Label>Brand Color</Label>
    <ColorField.Group>
      <ColorField.Input placeholder="#000000" />
    </ColorField.Group>
  </ColorField>
)

cases['color-field-disabled'] = () => (
  <ColorField isDisabled className="w-[280px]" defaultValue={parseColor('#6B7280')} name="color">
    <Label>Disabled</Label>
    <ColorField.Group>
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)

cases['color-field-invalid'] = () => (
  <ColorField isInvalid className="w-[280px]" defaultValue={parseColor('#0485F7')} name="color">
    <Label>Color</Label>
    <ColorField.Group>
      <ColorField.Input />
    </ColorField.Group>
    <FieldError>Please enter a valid color</FieldError>
  </ColorField>
)

cases['color-field-full-width'] = () => (
  <div className="w-[400px]">
    <ColorField fullWidth defaultValue={parseColor('#10B981')} name="color">
      <Label>Brand Color</Label>
      <ColorField.Group>
        <ColorField.Input />
      </ColorField.Group>
    </ColorField>
  </div>
)

cases['color-field-with-description'] = () => (
  <ColorField className="w-[280px]" defaultValue={parseColor('#3B82F6')} name="color">
    <Label>Primary Color</Label>
    <ColorField.Group>
      <ColorField.Input />
    </ColorField.Group>
    <Description>Enter your brand's primary color</Description>
  </ColorField>
)

cases['color-field-channel-editing'] = () => (
  <ColorField channel="hue" className="w-[280px]" colorSpace="hsl" defaultValue={parseColor('hsl(210, 100%, 50%)')} name="hue">
    <Label>Hue</Label>
    <ColorField.Group>
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)

cases['color-field-user-overrides'] = () => (
  <ColorField className="w-[280px]" defaultValue={parseColor('#0485F7')} name="color">
    <Label>Color</Label>
    <ColorField.Group className="rounded-none bg-accent-soft">
      <ColorField.Input />
    </ColorField.Group>
  </ColorField>
)
