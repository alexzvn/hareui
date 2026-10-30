// `@hareui/vue/code-block`: the CodeBlock component. Separate from the main entry so apps without it don't need
// the optional `shiki` peer dependency, which CodeBlock imports lazily to highlight code.
export * from './components/code-block'
