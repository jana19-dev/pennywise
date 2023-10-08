<script>
  export let account
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_DESCRIPTION } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { TextEditDialog } from "$lib/components/ui"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountDescriptionMutation = createMutation(UPDATE_ACCOUNT_DESCRIPTION, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_DESCRIPTION`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      description: yup.string()
    }),
    initialValues: {
      description: account.description
    },
    onSubmit: ({ description }) => {
      $updateAccountDescriptionMutation.mutate({
        id: account.id,
        description
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateAccountDescriptionMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      description: account.description
    })
  }
</script>

<TextEditDialog
  bind:dialog
  {isInline}
  name="description"
  label="Description"
  value={account.description}
  error={$errors[`description`]}
  serverError={$updateAccountDescriptionMutation.error?.message}
  isTouched={$touched[`description`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateAccountDescriptionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
