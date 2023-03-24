<script>
  export let dialog
  export let accountType = {}
  export let initialValue = ``

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

  const { form, errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
        name: yup.string().required(),
        accountTypeId: yup.string().required(),
        openingDate: yup.string().required(),
        openingBalance: yup
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
        name: initialValue,
        accountTypeId: accountType.id,
        openingDate: new Date(),
        openingBalance: 0
      },
      onSubmit: ({ name, accountTypeId, openingDate, openingBalance }) => {
        $createAccountMutation.mutate({
          name,
          accountTypeId,
          openingDate: formatDate(openingDate),
          openingBalance: parseFloat(openingBalance)
        })
      }
    })

  $: if (initialValue) {
    updateInitialValues({
      ...form.values,
      name: initialValue
    })
  }

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

<slot>
  {#if !accountType.id}
    <Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>
  {/if}
</slot>

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
      label="Opening Date"
      name="openingDate"
      type="date"
      isRequired
      isTouched={$touched[`openingDate`]}
      value={$form[`openingDate`]}
      error={$errors[`openingDate`]}
      on:pickDate={({ detail }) => ($form[`openingDate`] = detail.date)}
    />
    <TextInput
      type="number"
      inputProps={{ step: 0.01 }}
      name="openingBalance"
      label="Opening Balance"
      isRequired
      isTouched={$touched[`openingBalance`]}
      value={$form[`openingBalance`]}
      error={$errors[`openingBalance`]}
      on:change={handleChange}
      on:keyup={handleChange}
    />
  </div>
</FormDialog>
