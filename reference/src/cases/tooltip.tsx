import type {ReactElement} from "react";
import {Button, Tooltip} from "@heroui/react";

// Generous margin keeps the floating content away from the viewport edges so
// collision detection never flips the requested placement in either app.
function Wrapper({children}: {children: ReactElement}) {
  return <div style={{margin: 160}}>{children}</div>;
}

export const cases: Record<string, () => ReactElement> = {};

for (const placement of ["top", "right", "bottom", "left"] as const) {
  cases[`tooltip-${placement}`] = () => (
    <Wrapper>
      <Tooltip defaultOpen delay={0}>
        <Button variant="tertiary">Trigger</Button>
        <Tooltip.Content showArrow placement={placement}>
          <Tooltip.Arrow />
          <p>{placement} placement</p>
        </Tooltip.Content>
      </Tooltip>
    </Wrapper>
  );
}

cases["tooltip-no-arrow"] = () => (
  <Wrapper>
    <Tooltip defaultOpen delay={0}>
      <Button variant="tertiary">Trigger</Button>
      <Tooltip.Content>
        <p>No arrow</p>
      </Tooltip.Content>
    </Tooltip>
  </Wrapper>
);

cases["tooltip-text"] = () => (
  <Wrapper>
    <Tooltip defaultOpen delay={0}>
      <Button variant="tertiary">Trigger</Button>
      <Tooltip.Content>This is a tooltip</Tooltip.Content>
    </Tooltip>
  </Wrapper>
);
