<script>
  export let accountType
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_TYPE_NAME } from "$lib/graphql/client/accountType/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "$lib/components/ui"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountTypeNameMutation = createMutation(UPDATE_ACCOUNT_TYPE_NAME, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_TYPE_NAME`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required().min(3).max(50)
    }),
    initialValues: {
      name: accountType.name
    },
    onSubmit: ({ name }) => {
      $updateAccountTypeNameMutation.mutate({
        id: accountType.id,
        name
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateAccountTypeNameMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      name: accountType.name
    })
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  name="name"
  label="Name"
  value={accountType.name}
  error={$errors[`name`]}
  serverError={$updateAccountTypeNameMutation.error?.message}
  isTouched={$touched[`name`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateAccountTypeNameMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
