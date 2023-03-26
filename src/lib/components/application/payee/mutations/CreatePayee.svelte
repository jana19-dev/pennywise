<script>
  export let initialValue = ``
  export let dialog

  import { Button, FormDialog, TextInput } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { CREATE_PAYEE } from "$lib/graphql/client/payee/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  const createPayeeMutation = createMutation(CREATE_PAYEE, {
    onSuccess: () => {
      toast.success(`Successfully created the account type`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_PAYEE`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { form, errors, touched, handleChange, handleSubmit, handleReset } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required().min(3).max(50)
    }),
    initialValues: {
      name: initialValue
    },
    onSubmit: ({ name }) => {
      $createPayeeMutation.mutate({
        name
      })
    }
  })

  $: if (initialValue) {
    $form[`name`] = initialValue
  }

  const onClose = () => {
    handleReset()
    $createPayeeMutation.reset()
    dialog.hide()
  }
</script>

<slot>
  <Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>
</slot>

<FormDialog
  bind:dialog
  title="Create new payee"
  error={$createPayeeMutation?.error?.message}
  isLoading={$createPayeeMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="name"
>
  <div class="flex flex-col gap-8">
    <TextInput
      id="name"
      label="Name"
      name="name"
      isRequired
      isTouched={$touched[`name`]}
      value={$form[`name`]}
      error={$errors[`name`]}
      on:change={handleChange}
      on:keyup={handleChange}
    />
  </div>
</FormDialog>
