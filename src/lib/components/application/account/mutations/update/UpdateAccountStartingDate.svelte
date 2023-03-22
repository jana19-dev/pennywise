<script>
  export let account
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_STARTING_DATE } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  import { DateEditDialog } from "@codepiercer/svelte-tailwind"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountStartingDateMutation = createMutation(UPDATE_ACCOUNT_STARTING_DATE, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_STARTING_DATE`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, touched, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      startingDate: yup.string().required()
    }),
    initialValues: {
      startingDate: formatDate(account.startingDate.slice(0, -1))
    },
    onSubmit: ({ startingDate }) => {
      $updateAccountStartingDateMutation.mutate({
        id: account.id,
        startingDate
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateAccountStartingDateMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      startingDate: formatDate(account.startingDate.slice(0, -1))
    })
  }
</script>

<DateEditDialog
  bind:dialog
  isRequired
  {isInline}
  type="date"
  name="startingDate"
  label="Starting Date"
  value={formatDate(account.startingDate.slice(0, -1))}
  error={$errors[`startingDate`]}
  serverError={$updateAccountStartingDateMutation.error?.message}
  isTouched={$touched[`startingDate`]}
  on:pickDate={({ detail }) => ($form[`startingDate`] = detail.date)}
  isLoading={$updateAccountStartingDateMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
