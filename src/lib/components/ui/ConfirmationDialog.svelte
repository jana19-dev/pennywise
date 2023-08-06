<script>
  import { createEventDispatcher } from "svelte"

  import Button from "./Button.svelte"

  import ErrorAlert from "./ErrorAlert.svelte"
  import Dialog from "./Dialog.svelte"

  export let dialog
  export let title = `Form Dialog`
  export let mutation

  const dispatch = createEventDispatcher()

  const onConfirm = () => {
    dispatch(`confirm`)
  }

  const onClose = () => {
    dispatch(`close`)
  }
</script>

<Dialog bind:dialog closeOnEscape={false}>
  <h2 slot="header" class="text-xl font-semibold text-gray-900">{title}</h2>

  <div slot="content">
    <slot name="content" />
  </div>

  <div slot="footer" class="flex flex-col gap-4">
    {#if $mutation.isError}
      <ErrorAlert>
        {$mutation?.error?.message || `Something went wrong`}
      </ErrorAlert>
    {/if}
    <div class="flex justify-end gap-4">
      <Button on:click={onClose} variant="outlined" isDisabled={$mutation.isLoading}>Cancel</Button>
      <Button isLoading={$mutation.isLoading} color="red" on:click={onConfirm}>Confirm</Button>
    </div>
  </div>
</Dialog>
