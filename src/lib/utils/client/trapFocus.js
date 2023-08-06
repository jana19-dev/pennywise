let trapFocusList = []

if (typeof window !== `undefined`) {
  const isNext = (event) => event.keyCode === 9 && !event.shiftKey
  const isPrevious = (event) => event.keyCode === 9 && event.shiftKey
  const trapFocusListener = (event) => {
    if (event.target === window) {
      return
    }

    const eventTarget = event.target

    const parentNode = trapFocusList.find((node) => node.contains(eventTarget))
    if (!parentNode) {
      return
    }

    const focusable = parentNode.querySelectorAll(
      `a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]`
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (isNext(event) && event.target === last) {
      event.preventDefault()
      first.focus()
    } else if (isPrevious(event) && event.target === first) {
      event.preventDefault()
      last.focus()
    }
  }

  document.addEventListener(`keydown`, trapFocusListener)
}

export default function trapFocus(node) {
  trapFocusList.push(node)
  return {
    destroy() {
      trapFocusList = trapFocusList.filter((element) => element !== node)
    }
  }
}
