// `cn` of the HeroUI docs (`@/utils/cn`: clsx + tailwind-merge), built on HareUI's tailwind-merge configuration.
import { tv } from '@hareui/vue'

type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, unknown>

const merge = tv({})

export function cn(...inputs: ClassValue[]) {
  return merge({ class: inputs })
}
