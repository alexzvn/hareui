// Module-scoped so every program that reaches this file (library, docs) sees it; replaced by the consumer's bundler.
declare const process: { env: { NODE_ENV?: string } }

/**
 * Logs a `[hareui]`-prefixed warning in development.
 *
 * Guarded by `process.env.NODE_ENV`, not `import.meta.env.DEV`: Vite's library build inlines `import.meta.env.*`
 * as production values, which would drop every warning before consumers see it. `process.env.NODE_ENV` survives
 * the build, and the consumer's bundler replaces it, so their production builds remove the call.
 */
export const warn = (message: string) => {
  if (process.env.NODE_ENV === 'production') return

  console.warn(`[hareui] ${message}`)
}
