/** Exhaustiveness check for `switch` defaults over a finite union: compile error when a member is unhandled. */
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${String(value)}`)
}
