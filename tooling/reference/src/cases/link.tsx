import type { ReactElement } from 'react'
import { Link } from '@heroui/react'

const svg = <svg height="1em" viewBox="0 0 16 16" width="1em"><path d="M2 2h12v12H2z" fill="currentColor" /></svg>

export const cases: Record<string, () => ReactElement> = {
  'link-basic': () => <Link href="#">Call to action<Link.Icon /></Link>,
  'link-no-icon': () => <Link href="#">Call to action</Link>,
  'link-icon-start': () => <Link className="gap-1" href="#"><Link.Icon />Icon at start</Link>,
  'link-underline': () => <Link className="underline underline-offset-2" href="#">Underline always visible<Link.Icon /></Link>,
  'link-custom-icon': () => <Link href="#">External link<Link.Icon className="ms-1.5 size-3">{svg}</Link.Icon></Link>,
  'link-disabled': () => <Link isDisabled href="#">Disabled link<Link.Icon /></Link>,
  'link-custom-styles': () => <Link className="font-medium text-neutral-700 underline decoration-neutral-300/80 underline-offset-4 transition-colors hover:text-neutral-900" href="#">Call to action<Link.Icon /></Link>,
}
