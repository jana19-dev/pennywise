<script>
  export let transaction
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_MEMO } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"

  const queryClient = useQueryClient()

  let dialog

  const updateCategoryMemoMutation = createMutation(UPDATE_TRANSACTION_MEMO, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_MEMO`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
        memo: yup.string()
      }),
      initialValues: {
        memo: transaction.memo
      },
      onSubmit: ({ memo }) => {
        $updateCategoryMemoMutation.mutate({
          id: transaction.id,
          memo
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateCategoryMemoMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      memo: transaction.memo
    })
  }
</script>

<TextEditDialog
  bind:dialog
  {isInline}
  name="memo"
  label="Memo"
  value={transaction.memo}
  error={$errors[`memo`]}
  serverError={$updateCategoryMemoMutation.error?.message}
  isTouched={$touched[`memo`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateCategoryMemoMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
