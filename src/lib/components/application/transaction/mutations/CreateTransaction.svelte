<script>
  import { page } from "$app/stores"

  import { Button, FormDialog, TextInput, DateInput } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte"

  import SelectAccountInput from "$lib/components/select/SelectAccountInput.svelte"
  import SelectCategoryInput from "$lib/components/select/SelectCategoryInput.svelte"
  import SelectPayeeInput from "$lib/components/select/SelectPayeeInput.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { CREATE_TRANSACTION } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  const queryClient = useQueryClient()

  let dialog

  const createTransactionMutation = createMutation(CREATE_TRANSACTION, {
    onSuccess: () => {
      toast.success(`Successfully created the transaction`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_TRANSACTION`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  let isIncome = false
  const { form, errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
        date: yup.string().required(),
        accountId: yup.string().required(),
        categoryId: yup.string().required(),
        payeeId: yup.string().required(),
        amount: yup
          .number()
          .typeError(
            `The amount should be a positive decimal with maximum two digits of decimal places`
          )
          .test(
            `is-decimal`,
            `The amount should be a positive decimal with maximum two digits of decimal places`,
            (val) => {
              if (val != undefined) {
                return /^\d+(\.\d{0,2})?$/.test(val)
              }
              return true
            }
          )
          .required(),
        memo: yup.string()
      }),
      initialValues: {
        date: new Date(),
        accountId: $page.params.accountId
      },
      onSubmit: ({ date, accountId, categoryId, payeeId, amount, memo }) => {
        $createTransactionMutation.mutate({
          date: formatDate(date),
          accountId,
          categoryId,
          payeeId,
          amount: isIncome ? parseFloat(amount) : parseFloat(amount) * -1,
          memo
        })
      }
    })

  $: {
    updateInitialValues({
      accountId: $page.params.accountId
    })
  }

  const onClose = () => {
    handleReset()
    $createTransactionMutation.reset()
    isIncome = false
    dialog.hide()
  }
</script>

<Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>

<FormDialog
  bind:dialog
  title="Create new transaction"
  error={$createTransactionMutation?.error?.message}
  isLoading={$createTransactionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="date"
>
  <div class="flex flex-col gap-8">
    <DateInput
      class="flex-1"
      label="Date"
      name="date"
      type="date"
      isRequired
      isTouched={$touched[`date`]}
      value={$form[`date`]}
      error={$errors[`date`]}
      on:pickDate={({ detail }) => ($form[`date`] = detail.date)}
    />
    <SelectAccountInput
      isRequired
      name="accountId"
      label="Account "
      value={$form[`accountId`] || ``}
      error={$errors[`accountId`]}
      on:select={({ detail }) => {
        $form[`accountId`] = detail.option.value
      }}
    />
    <SelectCategoryInput
      isRequired
      name="categoryId"
      label="Category"
      value={$form[`categoryId`] || ``}
      error={$errors[`categoryId`]}
      on:select={({ detail }) => {
        $form[`categoryId`] = detail.option.value
      }}
    />
    <SelectPayeeInput
      isRequired
      name="payeeId"
      label="Payee"
      value={$form[`payeeId`] || ``}
      error={$errors[`payeeId`]}
      on:select={({ detail }) => {
        $form[`payeeId`] = detail.option.value
      }}
    />
    <div class="flex items-center justify-between gap-2">
      <TextInput
        type="number"
        inputProps={{ step: 0.01, min: 0 }}
        name="amount"
        label="Amount"
        isRequired
        isTouched={$touched[`amount`]}
        value={$form[`amount`]}
        error={$errors[`amount`]}
        on:change={handleChange}
        on:keyup={handleChange}
        class="flex-1"
      />
      <div class="flex items-center gap-2">
        <Button
          size="sm"
          color="green"
          variant={isIncome ? `secondary` : `ghost`}
          on:click={() => {
            isIncome = true
          }}
          >INCOME
          {#if isIncome}
            <CheckIcon />
          {/if}
        </Button>
        <Button
          size="sm"
          color="red"
          variant={!isIncome ? `secondary` : `ghost`}
          on:click={() => {
            isIncome = false
          }}
          >EXPENSE
          {#if !isIncome}
            <CheckIcon />
          {/if}
        </Button>
      </div>
    </div>
    <TextInput
      id="memo"
      label="Memo"
      name="memo"
      isTouched={$touched[`memo`]}
      value={$form[`memo`]}
      error={$errors[`memo`]}
      on:change={handleChange}
      on:keyup={handleChange}
    />
  </div>
</FormDialog>
