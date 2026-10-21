// Container: width and padding come from `--container-max-width` / `--container-padding`
// (styles/variables.css), the same values Header and Footer use, so page content lines up with their bars.
export default {
  slots: {
    base: 'mx-auto w-full max-w-(--container-max-width) px-(--container-padding)',
  },
}
