// cycle focus on li options with keyboard up or down
export default function trapUpDownFocus(e, selector = ``, onClose) {
  // close the menu if the user presses the escape key or tabs out
  if (e.key === `Escape` || e.key === `Tab`) {
    onClose()
  }
  // we're only interested in handling up & down arrow keys
  if (e.key !== `ArrowUp` && e.key !== `ArrowDown`) return
  // prevent the default behavior of scrolling the page
  e.preventDefault()
  // currently focused element (if any)
  const current = document.activeElement
  // get our collection of list elements and turn it into an actual array
  const items = [...document.querySelectorAll(selector)]
  // attempt to match the currently focused element to an index in our array of list elements
  const currentIndex = items.indexOf(current)
  // index of the list element to be newly focused
  let newIndex
  // if the currently focused element was NOT a list item, then default to focusing the first item in the list (index 0)
  if (currentIndex === -1) {
    newIndex = 0
    // otherwise, the currently focused element is an item in our list
  } else {
    if (e.key === `ArrowUp`) {
      newIndex = (currentIndex + items.length - 1) % items.length
    } else if (e.key === `ArrowDown`) {
      newIndex = (currentIndex + 1) % items.length
    }
  }
  if (items[newIndex]) {
    // blur (= unfocus) the currently focused element (whether it's a list element or not)
    current.blur()
    // focus the list element at the computed index
    items[newIndex]?.focus()
  }
}
