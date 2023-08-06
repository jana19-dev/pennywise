<script>
  export let dialog
  export let size = `md`
  export let closeOnOverlayClick = false
  export let closeOnEscape = true
  export let initialFocusID = null

  import { onMount } from "svelte"
  import { createEventDispatcher } from "svelte"

  import { twMerge } from "tailwind-merge"

  let isOpen = false

  $: if (isOpen) {
    // wait for the dialog to be rendered
    setTimeout(() => {
      // focus the first tabbable element
      const keyboardfocusableElements = [
        ...dialog.querySelectorAll(`a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])`)
      ].filter((el) => !el.hasAttribute(`disabled`) && !el.getAttribute(`aria-hidden`))
      const firstElement = keyboardfocusableElements.at(0)
      if (firstElement) {
        firstElement.focus()
      }
    })
  }

  const dispatch = createEventDispatcher()

  // expose methods to open and close the dialog
  onMount(() => {
    let scrollY
    let scrollX
    dialog.show = () => {
      dialog.showModal()
      if (!closeOnEscape) {
        // check closeOnEscape prop
        dialog.addEventListener(`cancel`, (event) => {
          event.preventDefault()
        })
      }
      if (closeOnOverlayClick) {
        // check closeOnOverlayClick prop
        dialog.addEventListener(`click`, onOverlayClick)
      }
      dialog.addEventListener(`keydown`, trapFocus)
      // save the current scroll position
      scrollY = document.documentElement.scrollTop
      scrollX = document.documentElement.scrollLeft
      document.body.style.overflow = `hidden`
      isOpen = true
      initialFocusID &&
        setTimeout(() => {
          const el = document.getElementById(initialFocusID)
          el && el.focus()
        }, 1)
    }
    dialog.hide = () => {
      dialog.removeEventListener(`keydown`, trapFocus)
      document.body.style.overflow = `auto`
      // scroll to the previous position
      if (scrollY) document.documentElement.scrollTop = scrollY
      if (scrollX) document.documentElement.scrollLeft = scrollX
      isOpen = false
      dialog.close()
    }
  })

  // close the dialog on backdrop click
  const onOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      dialog.hide()
      dispatch(`closeOnOverlay`)
    }
  }

  // trap focus inside the dialog
  const trapFocus = (e) => {
    const keyboardfocusableElements = [
      ...dialog.querySelectorAll(`a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])`)
    ].filter((el) => !el.hasAttribute(`disabled`) && !el.getAttribute(`aria-hidden`))

    const firstElement = keyboardfocusableElements.at(0)
    const lastElement = keyboardfocusableElements.at(-1)

    if (e.key === `Tab`) {
      const tabForwards = !e.shiftKey && document.activeElement === lastElement
      const tabBackwards = e.shiftKey && document.activeElement === firstElement

      if (tabForwards) {
        // only TAB is pressed, not SHIFT simultaneously
        // Prevent default behavior of keydown on TAB (i.e. focus next element)
        e.preventDefault()
        firstElement.focus()
      } else if (tabBackwards) {
        // TAB and SHIFT are pressed simultaneously
        e.preventDefault()
        lastElement.focus()
      }
    }
  }
</script>

<dialog
  bind:this={dialog}
  on:close
  class="w-[96%] rounded-lg border-none p-0 shadow-lg"
  class:max-w-xs={size === `xs`}
  class:max-w-sm={size === `sm`}
  class:max-w-md={size === `md`}
  class:max-w-lg={size === `lg`}
  class:max-w-xl={size === `xl`}
  class:max-w-2xl={size === `2xl`}
  class:max-w-3xl={size === `3xl`}
  class:max-w-4xl={size === `4xl`}
  class:max-w-5xl={size === `5xl`}
  class:max-w-6xl={size === `6xl`}
  class:max-w-7xl={size === `7xl`}
  class:max-w-[90%]={size === `full`}
>
  {#if isOpen}
    {#if $$slots.header}
      <!-- sticky header -->
      <div class="sticky top-0 z-10 bg-inherit p-4">
        <slot name="header" />
      </div>
    {/if}
    <!-- main content of dialog -->
    <div class={twMerge(`flex flex-1 flex-col overflow-y-auto p-4`, $$props.class)}>
      <slot name="content" />
    </div>
    {#if $$slots.footer}
      <!-- sticky footer -->
      <div class="sticky bottom-0 bg-inherit p-4">
        <slot name="footer" />
      </div>
    {/if}
  {/if}
</dialog>

<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.2rem);
  }
  dialog[open] {
    opacity: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
