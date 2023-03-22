<script>
  export let transaction
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_DATE } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  import { DateEditDialog } from "@codepiercer/svelte-tailwind"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateTransactionDateMutation = createMutation(UPDATE_TRANSACTION_DATE, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_DATE`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, touched, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      date: yup.string().required()
    }),
    initialValues: {
      date: formatDate(transaction.date.slice(0, -1))
    },
    onSubmit: ({ date }) => {
      $updateTransactionDateMutation.mutate({
        id: transaction.id,
        date
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateTransactionDateMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      date: formatDate(transaction.date.slice(0, -1))
    })
  }
</script>

<DateEditDialog
  bind:dialog
  isRequired
  {isInline}
  type="date"
  name="date"
  label="Date"
  value={formatDate(transaction.date.slice(0, -1))}
  error={$errors[`date`]}
  serverError={$updateTransactionDateMutation.error?.message}
  isTouched={$touched[`date`]}
  on:pickDate={({ detail }) => ($form[`date`] = detail.date)}
  isLoading={$updateTransactionDateMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
