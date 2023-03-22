import { toast } from "@zerodevx/svelte-toast"
import SuccessToast from "$lib/components/ui/SuccessToast.svelte"

function success(title, options = {}) {
  return toast.push({
    component: {
      src: SuccessToast,
      props: {
        title
      }
    },
    duration: 4000,
    dismissable: false,
    reversed: false,
    intro: { y: -50 },
    theme: {
      "--toastBarBackground": `#4ade80`,
      "--toastWidth": `340px`
    },
    ...options
  })
}

export default {
  success
}
