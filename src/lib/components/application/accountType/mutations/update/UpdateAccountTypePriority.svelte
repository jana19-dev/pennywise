<script>
  export let accountType
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_TYPE_PRIORITY } from "$lib/graphql/client/accountType/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountTypePriorityMutation = createMutation(UPDATE_ACCOUNT_TYPE_PRIORITY, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_TYPE_PRIORITY`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
        priority: yup.number()
      }),
      initialValues: {
        priority: accountType.priority
      },
      onSubmit: ({ priority }) => {
        $updateAccountTypePriorityMutation.mutate({
          id: accountType.id,
          priority: parseInt(priority)
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateAccountTypePriorityMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      priority: accountType.priority
    })
  }
</script>

<TextEditDialog
  bind:dialog
  {isInline}
  type="number"
  name="priority"
  label="Priority"
  value={accountType.priority}
  error={$errors[`priority`]}
  serverError={$updateAccountTypePriorityMutation.error?.message}
  isTouched={$touched[`priority`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateAccountTypePriorityMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
  mask="00"
/>
