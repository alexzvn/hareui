import type { ReactElement } from 'react'
import { ScrollShadow } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

const lines = (
  <div className="space-y-4">
    {Array.from({ length: 8 }, (_, i) => <p key={i}>{`Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}</p>)}
  </div>
)
const boxes = (
  <div className="flex flex-row gap-4">
    {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-16 min-w-[120px] rounded-xl bg-default">{`Box ${i + 1}`}</div>)}
  </div>
)

cases['scroll-shadow-vertical'] = () => <ScrollShadow className="max-h-[200px] w-[300px] p-4">{lines}</ScrollShadow>
cases['scroll-shadow-horizontal'] = () => <ScrollShadow className="w-[300px] p-4" orientation="horizontal">{boxes}</ScrollShadow>
cases['scroll-shadow-size'] = () => <ScrollShadow className="max-h-[200px] w-[300px] p-4" size={80}>{lines}</ScrollShadow>
cases['scroll-shadow-hide-scrollbar'] = () => <ScrollShadow hideScrollBar className="max-h-[200px] w-[300px] p-4">{lines}</ScrollShadow>
cases['scroll-shadow-visibility-both'] = () => <ScrollShadow className="max-h-[200px] w-[300px] p-4" visibility="both">{lines}</ScrollShadow>
cases['scroll-shadow-visibility-none'] = () => <ScrollShadow className="max-h-[200px] w-[300px] p-4" visibility="none">{lines}</ScrollShadow>
