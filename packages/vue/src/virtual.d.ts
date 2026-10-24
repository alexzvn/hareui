declare module 'virtual:hareui-component-names' {
  /** Component name → import path (`'@hareui/vue'` or `'@hareui/vue/charts'`). */
  const names: Record<string, string>
  export default names
}

/** Replaced by the consumer's bundler; read by `@/utils/warn` to drop dev warnings in production. */
declare const process: { env: { NODE_ENV?: string } }
