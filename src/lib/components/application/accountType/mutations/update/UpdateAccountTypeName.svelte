<script>
  export let accountType
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_TYPE_NAME } from "$lib/graphql/client/accountType/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"

  const queryClient = useQueryClient()

  let dialog

  const updateProductTypeNameMutation = createMutation(UPDATE_ACCOUNT_TYPE_NAME, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_TYPE_NAME`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
        name: yup.string().required().min(3).max(50)
      }),
      initialValues: {
        name: accountType.name
      },
      onSubmit: ({ name }) => {
        $updateProductTypeNameMutation.mutate({
          id: accountType.id,
          name
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateProductTypeNameMutation.reset()
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
  serverError={$updateProductTypeNameMutation.error?.message}
  isTouched={$touched[`name`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateProductTypeNameMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
