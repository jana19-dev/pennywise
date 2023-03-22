<script>
  export let accountType = {}
  export let dialog

  import { Button, FormDialog, DateInput, TextInput } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"

  import SelectAccountTypeInput from "$lib/components/select/SelectAccountTypeInput.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { CREATE_ACCOUNT } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  const queryClient = useQueryClient()

  const { form, errors, touched, handleChange, handleSubmit, handleReset } = createForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      accountTypeId: yup.string().required(),
      startingDate: yup.string().required(),
      startingBalance: yup
        .number()
        .test(
          `is-decimal`,
          `The amount should be a decimal with maximum two digits after comma`,
          (val) => {
            if (val != undefined) {
              return /^-?\d+(\.\d{0,2})?$/.test(val)
            }
            return true
          }
        )
        .required()
    }),
    initialValues: {
      accountTypeId: accountType.id,
      startingDate: new Date(),
      startingBalance: 0
    },
    onSubmit: ({ name, accountTypeId, startingDate, startingBalance }) => {
      $createAccountMutation.mutate({
        name,
        accountTypeId,
        startingDate: formatDate(startingDate),
        startingBalance: parseFloat(startingBalance)
      })
    }
  })

  const createAccountMutation = createMutation(CREATE_ACCOUNT, {
    onSuccess: () => {
      toast.success(`Successfully created the account`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_ACCOUNT_TYPE`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const onClose = () => {
    handleReset()
    $createAccountMutation.reset()
    dialog.hide()
  }
</script>

{#if !accountType.id}
  <Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>
{/if}

<FormDialog
  bind:dialog
  title="Crate new {accountType?.name || ''} account"
  error={$createAccountMutation?.error?.message}
  isLoading={$createAccountMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="name"
>
  <div class="flex flex-col gap-8">
    <TextInput
      id="name"
      label="Name"
      name="name"
      isRequired={!$form[`name`]}
      isTouched={$touched[`name`]}
      value={$form[`name`]}
      error={$errors[`name`]}
      on:change={handleChange}
      on:keyup={handleChange}
    />
    {#if !accountType.id}
      <SelectAccountTypeInput
        isRequired
        name="accountTypeId"
        label="Account Type"
        value={$form[`accountTypeId`] || ``}
        error={$errors[`accountTypeId`]}
        on:select={({ detail }) => {
          $form[`accountTypeId`] = detail.option.value
        }}
      />
    {/if}
    <DateInput
      class="flex-1"
      label="Starting Date"
      name="startingDate"
      type="date"
      isRequired
      isTouched={$touched[`startingDate`]}
      value={$form[`startingDate`]}
      error={$errors[`startingDate`]}
      on:pickDate={({ detail }) => ($form[`startingDate`] = detail.date)}
    />

    <TextInput
      type="number"
      inputProps={{ step: 0.01 }}
      name="startingBalance"
      label="Starting Balance"
      isRequired
      isTouched={$touched[`startingBalance`]}
      value={$form[`startingBalance`]}
      error={$errors[`startingBalance`]}
      on:change={handleChange}
      on:keyup={handleChange}
    />
  </div>
</FormDialog>
