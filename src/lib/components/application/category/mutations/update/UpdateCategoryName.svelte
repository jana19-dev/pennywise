<script>
  export let category
  export let isInline

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_CATEGORY_NAME } from "$lib/graphql/client/category/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"

  const queryClient = useQueryClient()

  let dialog

  const updateCategoryNameMutation = createMutation(UPDATE_CATEGORY_NAME, {
    onSuccess: () => {
      toast.success(`Successfully updated`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_CATEGORY_NAME`].includes(queryKey[0])
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
        name: category.name
      },
      onSubmit: ({ name }) => {
        $updateCategoryNameMutation.mutate({
          id: category.id,
          name
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateCategoryNameMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      name: category.name
    })
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  name="name"
  label="Name"
  value={category.name}
  error={$errors[`name`]}
  serverError={$updateCategoryNameMutation.error?.message}
  isTouched={$touched[`name`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateCategoryNameMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
/>
