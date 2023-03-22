<script>
  export let account

  import { FormDialog, Button } from "@codepiercer/svelte-tailwind"
  import TrashIcon from "@codepiercer/svelte-tailwind/icons/TrashIcon.svelte"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { DELETE_ACCOUNT } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const deleteAccountMutation = createMutation(DELETE_ACCOUNT, {
    onSuccess: () => {
      toast.success(`Successfully deleted the account`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`DELETE_ACCOUNT`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const handleSubmit = () => {
    $deleteAccountMutation.mutate({
      id: account.id
    })
  }

  const onOpen = () => {
    dialog.show()
  }

  const onClose = () => {
    $deleteAccountMutation.reset()
    dialog.hide()
  }
</script>

<Button variant="ghost" class="my-0.5 p-1 px-1.5" on:click={onOpen} color="red">
  <span class="sr-only">Delete Account</span>
  <TrashIcon />
</Button>

<FormDialog
  bind:dialog
  title="Delete account"
  error={$deleteAccountMutation?.error?.message}
  isLoading={$deleteAccountMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  submitLabel="Delete"
  submitColor="red"
>
  <div class="flex flex-col gap-8">
    <p class="text-base text-gray-500">Are you sure you want to delete this account?</p>
    <div class="-mt-4 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
      <p class="inline-block rounded-md bg-orange-100 p-1 px-2">{account.name}</p>
    </div>
  </div>
</FormDialog>
