<script>
  export let account
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { SelectInputEditDialog } from "@codepiercer/svelte-tailwind"
  import SelectAccountTypeInput from "$lib/components/select/SelectAccountTypeInput.svelte"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_TYPE } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountTypeMutation = createMutation(UPDATE_ACCOUNT_TYPE, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_TYPE`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { form, errors, handleSubmit, handleReset, updateInitialValues } = createForm({
    validationSchema: yup.object().shape({
      accountTypeId: yup.string()
    }),
    initialValues: {
      accountTypeId: account.accountType?.id
    },
    onSubmit: ({ accountTypeId }) => {
      $updateAccountTypeMutation.mutate({
        id: account.id,
        accountTypeId
      })
    }
  })

  const onClose = () => {
    handleReset()
    $updateAccountTypeMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      accountTypeId: account.accountType?.id
    })
  }
</script>

<SelectInputEditDialog
  bind:dialog
  {isInline}
  label="Account Type"
  serverError={$updateAccountTypeMutation.error?.message}
  isLoading={$updateAccountTypeMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
>
  <span>{account.accountType?.name || `-`}</span>
  <div slot="input">
    <SelectAccountTypeInput
      name="accountTypeId"
      isRequired
      label="Account Type"
      value={$form[`accountTypeId`]}
      error={$errors[`accountTypeId`]}
      on:select={({ detail }) => {
        $form[`accountTypeId`] = detail.option.value
      }}
    />
  </div>
</SelectInputEditDialog>
