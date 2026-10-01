import type { ReactElement } from 'react'
import { Skeleton } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

for (const animationType of ['shimmer', 'pulse', 'none'] as const)
  cases[`skeleton-${animationType}`] = () => <Skeleton animationType={animationType} className="h-10 w-40" />
cases['skeleton-default'] = () => <Skeleton className="h-10 w-40" />
cases['skeleton-custom'] = () => (
  <div className="w-[250px] space-y-5 p-4">
    <Skeleton className="h-32 rounded-lg" />
    <div className="space-y-3">
      <Skeleton className="h-3 w-3/5 rounded-lg" />
      <Skeleton className="h-3 w-4/5 rounded-full bg-neutral-200/90" />
    </div>
  </div>
)
cases['skeleton-children'] = () => <Skeleton className="w-40 p-2"><span className="invisible">Loading text</span></Skeleton>
