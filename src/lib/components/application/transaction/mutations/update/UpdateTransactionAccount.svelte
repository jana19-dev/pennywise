<script>
  export let transaction
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { SelectInputEditDialog } from "@codepiercer/svelte-tailwind"
  import SelectAccountInput from "$lib/components/select/SelectAccountInput.svelte"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_ACCOUNT } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateTransactionAccountMutation = createMutation(UPDATE_TRANSACTION_ACCOUNT, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_ACCOUNT`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      accountId: yup.string().required()
    }),
    initialValues: {
      accountId: transaction.account?.id
    },
    onSubmit: ({ accountId }) => {
      $updateTransactionAccountMutation.mutate({
        id: transaction.id,
        accountId
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateTransactionAccountMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      accountId: transaction.account?.id
    })
  }
</script>

<SelectInputEditDialog
  bind:dialog
  {isInline}
  label="Account"
  serverError={$updateTransactionAccountMutation.error?.message}
  isLoading={$updateTransactionAccountMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
>
  <a href="/transactions/{transaction.account.id}">{transaction.account.name || `-`}</a>
  <div slot="input">
    <SelectAccountInput
      isRequired
      name="accountId"
      label="Account"
      value={$form[`accountId`]}
      error={$errors[`accountId`]}
      on:select={({ detail }) => {
        $form[`accountId`] = detail.option.value
      }}
    />
  </div>
</SelectInputEditDialog>
