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

  const { form, errors, touched, handleChange, handleSubmit, handleReset } = createForm({
    validationSchema: yup.object().shape({
      date: yup.string().required(),
      accountId: yup.string().required(),
      categoryId: yup.string(),
      payeeId: yup.string(),
      transferAccountId: yup.string(),
      amount: yup
        .number()
        .typeError(
          `The amount should be a positive number with maximum two digits of decimal places`
        )
        .test(
          `is-decimal`,
          `The amount should be a positive number with maximum two digits of decimal places`,
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
      accountId: $page.params.accountId,
      transactionType: `expense`, // expense or income or transferTo or transferFrom
      transferAccountId: undefined,
      amount: undefined
    },
    onSubmit: ({ date, accountId, categoryId, payeeId, transferAccountId, amount, memo }) => {
      $createTransactionMutation.mutate({
        date: formatDate(date),
        accountId,
        categoryId,
        payeeId,
        transferAccountId,
        amount: [`income`, `transferFrom`].includes($form.transactionType)
          ? parseFloat(amount)
          : parseFloat(amount) * -1,
        memo
      })
    }
  })

  $: if ($page.params.accountId) {
    $form[`accountId`] = $page.params.accountId
  }

  const onClose = () => {
    handleReset()
    $createTransactionMutation.reset()
    dialog.hide()
  }
</script>

<Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>

<FormDialog
  bind:dialog
  size="lg"
  title="Create new transaction"
  error={$createTransactionMutation?.error?.message}
  isLoading={$createTransactionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="amount"
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
    <TextInput
      id="amount"
      type="number"
      inputProps={{
        step: 0.01,
        min: 0
      }}
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
    <div class="flex items-center justify-center gap-2">
      <Button
        size="sm"
        class="py-1 px-1"
        color="green"
        variant={$form[`transactionType`] === `income` ? `secondary` : `ghost`}
        on:click={() => {
          $form[`transactionType`] = `income`
        }}
        >INCOME
        {#if $form[`transactionType`] === `income`}
          <CheckIcon />
        {/if}
      </Button>
      <Button
        size="sm"
        class="py-1 px-1"
        color="red"
        variant={$form[`transactionType`] === `expense` ? `secondary` : `ghost`}
        on:click={() => {
          $form[`transactionType`] = `expense`
        }}
        >EXPENSE
        {#if $form[`transactionType`] === `expense`}
          <CheckIcon />
        {/if}
      </Button>
      <Button
        size="sm"
        class="py-1 px-1"
        color="blue"
        variant={$form[`transactionType`] === `transferTo` ? `secondary` : `ghost`}
        on:click={() => {
          $form[`transactionType`] = `transferTo`
          $errors[`amount`] = undefined
        }}
        >TRANSFER TO
        {#if $form[`transactionType`] === `transferTo`}
          <CheckIcon />
        {/if}
      </Button>
      <Button
        size="sm"
        class="py-1 px-1"
        color="blue"
        variant={$form[`transactionType`] === `transferFrom` ? `secondary` : `ghost`}
        on:click={() => {
          $form[`transactionType`] = `transferFrom`
          $errors[`amount`] = undefined
        }}
        >TRANSFER FROM
        {#if $form[`transactionType`] === `transferFrom`}
          <CheckIcon />
        {/if}
      </Button>
    </div>
    {#if [`income`, `expense`].includes($form[`transactionType`])}
      <div class="flex flex-col gap-8 lg:flex-row">
        <SelectCategoryInput
          isRequired
          direction="top"
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
          direction="top"
          name="payeeId"
          label="Payee"
          value={$form[`payeeId`] || ``}
          error={$errors[`payeeId`]}
          on:select={({ detail }) => {
            $form[`payeeId`] = detail.option.value
          }}
        />
      </div>
    {/if}
    {#if [`transferTo`, `transferFrom`].includes($form[`transactionType`])}
      <SelectAccountInput
        direction="top"
        isRequired
        name="transferAccountId"
        label={$form[`transactionType`] === `transferTo` ? `To Account` : `From Account`}
        value={$form[`transferAccountId`] || ``}
        error={$errors[`transferAccountId`]}
        on:select={({ detail }) => {
          $form[`transferAccountId`] = detail.option.value
        }}
      />
    {/if}
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
