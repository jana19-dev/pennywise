<script>
  export let transaction
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_CATEGORY } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { SelectInputEditDialog } from "@codepiercer/svelte-tailwind"
  import SelectCategoryInput from "$lib/components/select/SelectCategoryInput.svelte"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateTransactionCategoryMutation = createMutation(UPDATE_TRANSACTION_CATEGORY, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_CATEGORY`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      categoryId: yup.string().required()
    }),
    initialValues: {
      categoryId: transaction.category?.id
    },
    onSubmit: ({ categoryId }) => {
      $updateTransactionCategoryMutation.mutate({
        id: transaction.id,
        categoryId
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateTransactionCategoryMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      categoryId: transaction.category?.id
    })
  }
</script>

<SelectInputEditDialog
  bind:dialog
  {isInline}
  label="Category"
  serverError={$updateTransactionCategoryMutation.error?.message}
  isLoading={$updateTransactionCategoryMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
>
  <span>{transaction.category?.name || `-`}</span>
  <div slot="input">
    <SelectCategoryInput
      isRequired
      name="categoryId"
      label="Category"
      value={$form[`categoryId`]}
      error={$errors[`categoryId`]}
      on:select={({ detail }) => {
        $form[`categoryId`] = detail.option.value
      }}
    />
  </div>
</SelectInputEditDialog>
