// Port of HeroUI docs `hooks/use-code-panel.tsx`. HeroUI scopes it with a React context per page;
// the theme builder is the only user, so one module-level ref is enough.
import { ref } from 'vue'

const isCodeVisible = ref(false)

export const useCodePanel = () => {
  return {
    isCodeVisible,
    setIsCodeVisible: (visible: boolean) => (isCodeVisible.value = visible),
    toggleCode: () => (isCodeVisible.value = !isCodeVisible.value),
  }
}
