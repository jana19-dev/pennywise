<script>
  import { tick } from "svelte"
  import { createEventDispatcher } from "svelte"

  import Button from "./Button.svelte"
  import ClipboardDocumentIcon from "$lib/components/icons/ClipboardDocumentIcon.svelte"

  export let text

  let textarea

  const dispatch = createEventDispatcher()

  async function copy() {
    // Select the text field
    textarea.select()
    textarea.setSelectionRange(0, 99999) // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(textarea.value)

    await tick()
    textarea.blur()
    dispatch(`copied`)
  }
</script>

<Button on:click={copy} color="yellow" size="sm" variant="outlined"><ClipboardDocumentIcon /></Button>
<textarea bind:this={textarea} value={text} class="absolute inset-0 block h-0 w-0 border-none opacity-0" />
