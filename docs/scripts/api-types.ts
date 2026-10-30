/** A member of a prop whose type is a named object type (a nested prop group). */
export type ApiPropMember = {
  name: string
  type: string
  default?: string
  description: string
}

export type ApiProp = {
  name: string
  type: string
  default?: string
  description: string
  required: boolean
  members?: ApiPropMember[]
}

export type ApiSlot = {
  name: string
  type: string
  description: string
}

export type ApiEvent = {
  name: string
  type: string
  description: string
}

export type ComponentApi = {
  props: ApiProp[]
  slots: ApiSlot[]
  events: ApiEvent[]
}
