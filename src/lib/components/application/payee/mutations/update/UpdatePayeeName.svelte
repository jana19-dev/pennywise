<script>
  export let payee
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_PAYEE_NAME } from "$lib/graphql/client/payee/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "$lib/components/ui"

  const queryClient = useQueryClient()

  let dialog

  const updatePayeeNameMutation = createMutation(UPDATE_PAYEE_NAME, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_PAYEE_NAME`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required().min(3).max(50)
    }),
    initialValues: {
      name: payee.name
    },
    onSubmit: ({ name }) => {
      $updatePayeeNameMutation.mutate({
        id: payee.id,
        name
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updatePayeeNameMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      name: payee.name
    })
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  name="name"
  label="Name"
  value={payee.name}
  error={$errors[`name`]}
  serverError={$updatePayeeNameMutation.error?.message}
  isTouched={$touched[`name`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updatePayeeNameMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
