// Public locations of the project, shared by the navbars and the component page header.
export const REPO_URL = 'https://github.com/alexzvn/hareui'
export const REPO_BRANCH = 'main'

/** GitHub URL of a file in the repository, e.g. `packages/vue/src/components/button/Button.vue`. */
export function repoFileUrl(path: string) {
  return `${REPO_URL}/blob/${REPO_BRANCH}/${path}`
}
