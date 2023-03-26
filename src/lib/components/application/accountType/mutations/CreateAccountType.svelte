<script>
  export let initialValue = ``
  export let dialog

  import { Button, FormDialog, TextInput } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { CREATE_ACCOUNT_TYPE } from "$lib/graphql/client/accountType/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  const createAccountTypeMutation = createMutation(CREATE_ACCOUNT_TYPE, {
    onSuccess: () => {
      toast.success(`Successfully created the account type`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_ACCOUNT_TYPE`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { form, errors, touched, handleChange, handleSubmit, handleReset } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required().min(3).max(50),
      priority: yup.number().typeError(`Order must be a number`)
    }),
    initialValues: {
      name: initialValue,
      priority: 0
    },
    onSubmit: ({ name, priority }) => {
      $createAccountTypeMutation.mutate({
        name,
        priority: parseInt(priority)
      })
    }
  })

  $: if (initialValue) {
    $form[`name`] = initialValue
  }

  const onClose = () => {
    handleReset()
    $createAccountTypeMutation.reset()
    dialog.hide()
  }
</script>

<slot>
  <Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>
</slot>

<FormDialog
  bind:dialog
  title="Create new account type"
  error={$createAccountTypeMutation?.error?.message}
  isLoading={$createAccountTypeMutation.isLoading}
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
    <TextInput
      type="number"
      label="Priority"
      name="priority"
      isTouched={$touched[`priority`]}
      value={$form[`priority`]}
      error={$errors[`priority`]}
      on:change={handleChange}
      on:keyup={handleChange}
      mask="00"
    />
  </div>
</FormDialog>
