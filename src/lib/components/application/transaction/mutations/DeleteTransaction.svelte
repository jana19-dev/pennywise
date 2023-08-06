<script>
  export let transaction

  import { FormDialog, Button } from "$lib/components/ui"
  import TrashIcon from "$lib/components/icons/TrashIcon.svelte"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { DELETE_TRANSACTION } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const deleteTransactionMutation = createMutation(DELETE_TRANSACTION, {
    onSuccess: () => {
      toast.success(`Successfully deleted the transaction`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`DELETE_TRANSACTION`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const handleSubmit = () => {
    $deleteTransactionMutation.mutate({
      id: transaction.id
    })
  }

  const onOpen = () => {
    dialog.show()
  }

  const onClose = () => {
    $deleteTransactionMutation.reset()
    dialog.hide()
  }
</script>

<Button
  variant="ghost"
  class="my-0.5 p-1 px-1.5"
  on:click={onOpen}
  color="red"
  isDisabled={!transaction.transferTo && !transaction.payee && !transaction.category}
>
  <span class="sr-only">Delete Transaction</span>
  <TrashIcon />
</Button>

<FormDialog
  bind:dialog
  title="Delete transaction"
  error={$deleteTransactionMutation?.error?.message}
  isLoading={$deleteTransactionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  submitLabel="Delete"
  submitColor="red"
>
  <div class="flex flex-col gap-8">
    <p class="text-base text-gray-500">Are you sure you want to delete this transaction?</p>
    <div class="-mt-4 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
      <p class="inline-block rounded-md bg-orange-50 p-2 px-2">
        {transaction.payee?.name || transaction.transferTo?.account?.name}: <CurrencyView amount={transaction.amount} />
      </p>
    </div>
  </div>
</FormDialog>
