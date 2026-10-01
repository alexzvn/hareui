import type {ReactElement} from "react";
import {ToastProvider, ToastQueue} from "@heroui/react";

// Each case gets its own queue (not the shared default) so toasts are enqueued
// synchronously before first paint, with no `open` action or timing race - the
// same pattern the Vue side uses.
function queueWith(...adds: Array<[Parameters<ToastQueue["add"]>[0], Parameters<ToastQueue["add"]>[1]?]>) {
  const queue = new ToastQueue();
  for (const [content, options] of adds) queue.add(content, {timeout: 0, ...options});
  return queue;
}

const starIcon = (
  <svg aria-hidden="true" fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
    <path d="M8 1l1.9 4.6L15 6l-3.8 3.3L12.4 15 8 12.1 3.6 15l1.2-5.7L1 6l5.1-.4L8 1z" />
  </svg>
);

export const cases: Record<string, () => ReactElement> = {};

cases["toast-default"] = () => (
  <ToastProvider queue={queueWith([{title: "Simple message", description: "This is a toast description", variant: "default"}])} />
);

cases["toast-accent"] = () => (
  <ToastProvider queue={queueWith([{title: "New update available", description: "Version 2.0 is ready to install", variant: "accent"}])} />
);

cases["toast-success"] = () => (
  <ToastProvider queue={queueWith([{title: "Operation completed", description: "Your changes have been saved", variant: "success"}])} />
);

cases["toast-warning"] = () => (
  <ToastProvider queue={queueWith([{title: "Please check your settings", description: "Some fields require your attention", variant: "warning"}])} />
);

cases["toast-danger"] = () => (
  <ToastProvider queue={queueWith([{title: "Something went wrong", description: "Please try again later", variant: "danger"}])} />
);

cases["toast-with-action"] = () => (
  <ToastProvider
    queue={queueWith([
      {
        actionProps: {children: "Undo", variant: "tertiary"},
        description: "Bob sent you an invitation to join the team",
        title: "You have been invited to join a team",
        variant: "default",
      },
    ])}
  />
);

cases["toast-custom-indicator"] = () => (
  <ToastProvider queue={queueWith([{indicator: starIcon, title: "Achievement unlocked", variant: "default"}])} />
);

cases["toast-loading"] = () => (
  <ToastProvider queue={queueWith([{isLoading: true, title: "Saving…", variant: "default"}])} />
);

for (const placement of ["top", "top start", "top end", "bottom start", "bottom end"] as const) {
  cases[`toast-placement-${placement.replace(" ", "-")}`] = () => (
    <ToastProvider
      placement={placement}
      queue={queueWith([{title: `${placement} placement`, variant: "default"}])}
    />
  );
}

cases["toast-stacked"] = () => (
  <ToastProvider
    queue={queueWith(
      [{title: "Simple message", variant: "default"}],
      [{title: "Operation completed", variant: "success"}],
      [{title: "New update available", variant: "accent"}],
    )}
  />
);

cases["toast-expanded"] = () => (
  <ToastProvider
    isExpanded
    queue={queueWith(
      [{title: "Simple message", variant: "default"}],
      [{description: "Your changes have been saved", title: "Operation completed", variant: "success"}],
      [{title: "New update available", variant: "accent"}],
    )}
  />
);
