export interface ApiProp {
  name: string
  type: string
  default?: string
  description: string
  required: boolean
}

export interface ApiSlot {
  name: string
  type: string
  description: string
}

export interface ApiEvent {
  name: string
  type: string
  description: string
}

export interface ComponentApi {
  props: ApiProp[]
  slots: ApiSlot[]
  events: ApiEvent[]
}
