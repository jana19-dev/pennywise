<script>
  export let payee

  import { FormDialog, Button } from "$lib/components/ui"
  import TrashIcon from "$lib/components/icons/TrashIcon.svelte"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { DELETE_PAYEE } from "$lib/graphql/client/payee/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const deletePayeeMutation = createMutation(DELETE_PAYEE, {
    onSuccess: () => {
      toast.success(`Successfully deleted the payee`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`DELETE_PAYEE`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const handleSubmit = () => {
    $deletePayeeMutation.mutate({
      id: payee.id
    })
  }

  const onOpen = () => {
    dialog.show()
  }

  const onClose = () => {
    $deletePayeeMutation.reset()
    dialog.hide()
  }
</script>

<Button variant="ghost" class="my-0.5 p-1 px-1.5" on:click={onOpen} color="red">
  <span class="sr-only">Delete Payee</span>
  <TrashIcon />
</Button>

<FormDialog
  bind:dialog
  title="Delete payee"
  error={$deletePayeeMutation?.error?.message}
  isLoading={$deletePayeeMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  submitLabel="Delete"
  submitColor="red"
>
  <div class="flex flex-col gap-8">
    <p class="text-base text-gray-500">Are you sure you want to delete this payee?</p>
    <div class="-mt-4 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
      <p class="inline-block rounded-md bg-orange-100 p-1 px-2">{payee.name}</p>
    </div>
  </div>
</FormDialog>
