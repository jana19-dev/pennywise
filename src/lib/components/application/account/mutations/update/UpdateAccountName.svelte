<script>
  export let account
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_NAME } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"

  import { TextEditDialog } from "$lib/components/ui"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountNameMutation = createMutation(UPDATE_ACCOUNT_NAME, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_NAME`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required().min(3).max(50)
    }),
    initialValues: {
      name: account.name
    },
    onSubmit: ({ name }) => {
      $updateAccountNameMutation.mutate({
        id: account.id,
        name
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateAccountNameMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      name: account.name
    })
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  name="name"
  label="Name"
  value={account.name}
  error={$errors[`name`]}
  serverError={$updateAccountNameMutation.error?.message}
  isTouched={$touched[`name`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateAccountNameMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
>
  <a href="/transactions/{account.id}">{account.name || `-`}</a>
</TextEditDialog>
