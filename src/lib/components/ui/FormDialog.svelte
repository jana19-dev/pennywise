<script>
  import { createEventDispatcher } from "svelte"

  import Button from "./Button.svelte"
  import ErrorAlert from "./ErrorAlert.svelte"
  import Dialog from "./Dialog.svelte"

  const id = `${Math.random()}`
  export let dialog
  export let title = `Form Dialog`
  export let error = ``
  export let isLoading = false
  export let isDisabled = false
  export let initialFocusID = null
  export let submitLabel = `Submit`
  export let submitColor = `blue`
  export let size = `md`

  const dispatch = createEventDispatcher()

  const onClose = () => {
    dispatch(`close`)
  }
</script>

<Dialog bind:dialog closeOnEscape={false} class={$$props.class} {initialFocusID} {size}>
  <h2 slot="header" class="text-xl font-semibold text-gray-900">{title}</h2>

  <form slot="content" {id} on:submit|preventDefault>
    <slot />
  </form>

  <div slot="footer" class="flex flex-col gap-4">
    {#if error}
      <ErrorAlert>
        {error}
      </ErrorAlert>
    {/if}
    <div class="flex justify-end gap-4">
      <Button on:click={onClose} variant="outlined" isDisabled={isLoading}>Close</Button>
      <Button form={id} {isLoading} {isDisabled} type="submit" color={submitColor}
        >{submitLabel}</Button
      >
    </div>
  </div>
</Dialog>
