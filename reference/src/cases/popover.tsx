import type {ReactElement} from "react";
import {Popover} from "@heroui/react";
import {Button} from "react-aria-components";

// Generous margin keeps the floating content away from the viewport edges so
// collision detection never flips the requested placement in either app. React
// Aria's `DialogTrigger` (which `Popover` wraps) only wires up the overlay's anchor
// ref through its `ButtonContext`, so the trigger must be react-aria-components'
// unstyled `Button` (not a raw `<button>`, which silently leaves the popover
// unanchored) - it renders a plain, class-free `<button>` with no HeroUI styling,
// keeping the comparison scoped to the popover itself.
function Wrapper({children}: {children: ReactElement}) {
  return <div style={{margin: 160}}>{children}</div>;
}

export const cases: Record<string, () => ReactElement> = {};

for (const placement of ["top", "right", "bottom", "left"] as const) {
  cases[`popover-${placement}`] = () => (
    <Wrapper>
      <Popover defaultOpen>
        <Button>Trigger</Button>
        <Popover.Content data-slot="popover" placement={placement}>
          <Popover.Dialog>
            <Popover.Arrow />
            <p className="text-sm">{placement} placement</p>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </Wrapper>
  );
}

cases["popover-no-arrow"] = () => (
  <Wrapper>
    <Popover defaultOpen>
      <Button>Trigger</Button>
      <Popover.Content data-slot="popover">
        <Popover.Dialog>
          <p className="text-sm">No arrow</p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  </Wrapper>
);

cases["popover-title"] = () => (
  <Wrapper>
    <Popover defaultOpen>
      <Button>Trigger</Button>
      <Popover.Content data-slot="popover">
        <Popover.Dialog>
          <Popover.Heading data-slot="popover-heading">Popover Title</Popover.Heading>
          <p className="mt-2 text-sm text-muted">This is the popover content.</p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  </Wrapper>
);
