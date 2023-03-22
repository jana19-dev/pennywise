<script>
  export let transaction
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_PAYEE } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { SelectInputEditDialog } from "@codepiercer/svelte-tailwind"
  import SelectPayeeInput from "$lib/components/select/SelectPayeeInput.svelte"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateTransactionPayeeMutation = createMutation(UPDATE_TRANSACTION_PAYEE, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_PAYEE`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      payeeId: yup.string().required()
    }),
    initialValues: {
      payeeId: transaction.payee?.id
    },
    onSubmit: ({ payeeId }) => {
      $updateTransactionPayeeMutation.mutate({
        id: transaction.id,
        payeeId
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateTransactionPayeeMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      payeeId: transaction.payee?.id
    })
  }
</script>

<SelectInputEditDialog
  bind:dialog
  {isInline}
  label="Payee"
  serverError={$updateTransactionPayeeMutation.error?.message}
  isLoading={$updateTransactionPayeeMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
>
  <span>{transaction.payee?.name || `-`}</span>
  <div slot="input">
    <SelectPayeeInput
      isRequired
      name="payeeId"
      label="Payee"
      value={$form[`payeeId`]}
      error={$errors[`payeeId`]}
      on:select={({ detail }) => {
        $form[`payeeId`] = detail.option.value
      }}
    />
  </div>
</SelectInputEditDialog>
