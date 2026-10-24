export type ApiProp = {
  name: string
  type: string
  default?: string
  description: string
  required: boolean
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
