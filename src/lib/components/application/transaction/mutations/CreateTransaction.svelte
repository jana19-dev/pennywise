<script>
  import { tick } from "svelte"
  import { page } from "$app/stores"

  import { Button, FormDialog, TextInput, DateInput } from "$lib/components/ui"
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte"
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte"

  import SelectAccountInput from "$lib/components/select/SelectAccountInput.svelte"
  import SelectCategoryInput from "$lib/components/select/SelectCategoryInput.svelte"
  import SelectPayeeInput from "$lib/components/select/SelectPayeeInput.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query"
  import { CREATE_TRANSACTION } from "$lib/graphql/client/transaction/mutations"
  import { GET_RECENT_TRANSACTION } from "$lib/graphql/client/transaction/queries"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { formatDate } from "$lib/utils/client/date"

  const queryClient = useQueryClient()

  let dialog

  const createTransactionMutation = createMutation(CREATE_TRANSACTION, {
    onSuccess: () => {
      toast.success(`Successfully created the transaction`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_TRANSACTION`].includes(queryKey[0])
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
      amount: yup
        .number()
        .typeError(`The amount should be a positive number with maximum two digits of decimal places`)
        .test(`is-decimal`, `The amount should be a positive number with maximum two digits of decimal places`, (val) => {
          if (val != undefined) {
            return /^\d+(\.\d{0,2})?$/.test(val)
          }
          return true
        })
        .required(),
      memo: yup.string()
    }),
    initialValues: {
      date: new Date(),
      accountId: $page.params.accountId,
      transactionType: `expense`, // expense or income
      amount: undefined
    },
    onSubmit: ({ date, accountId, categoryId, payeeId, amount, memo }) => {
      $createTransactionMutation.mutate({
        date: formatDate(date),
        accountId,
        categoryId,
        payeeId,
        amount: [`income`].includes($form.transactionType) ? parseFloat(amount) : parseFloat(amount) * -1,
        memo
      })
    }
  })

  $: queryResult = createQuery(
    [
      `GET_RECENT_TRANSACTION`,
      {
        payeeId: $form[`payeeId`],
        isTransfer: false
      }
    ],
    GET_RECENT_TRANSACTION,
    {
      enabled: false
    }
  )

  $: if ($page.params.accountId) {
    $form[`accountId`] = $page.params.accountId
  }

  const onClose = () => {
    handleReset()
    $form[`accountId`] = $page.params.accountId
    $createTransactionMutation.reset()
    dialog.hide()
  }
</script>

<Button on:click={dialog.show} class="px-2 pr-3"><PlusIcon class="mr-1" />New</Button>

<FormDialog
  bind:dialog
  size="lg"
  title="Create a new transaction"
  error={$createTransactionMutation?.error?.message}
  isLoading={$createTransactionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="payeeId"
  class="min-h-[21rem]"
>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-8 lg:flex-row">
      <DateInput
        class="flex-1"
        label="Date"
        name="date"
        type="date"
        isRequired
        isTouched={$touched[`date`]}
        value={$form[`date`]}
        error={$errors[`date`]}
        on:pickDate={({ detail }) => {
          $form[`date`] = detail.date
        }}
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
    </div>

    <div class="flex flex-col gap-8 lg:flex-row">
      <SelectPayeeInput
        id="payeeId"
        isRequired
        name="payeeId"
        label="Payee"
        value={$form[`payeeId`] || ``}
        error={$errors[`payeeId`]}
        on:select={async ({ detail }) => {
          $form[`payeeId`] = detail.option.value
          if ($form[`categoryId`]) return
          // get the recent category of the payee
          await tick()
          $queryResult.refetch().then((res) => {
            if (res.data?.categoryId) {
              $form[`categoryId`] = res.data.categoryId
              $form.transactionType = res.data.amount < 0 ? `expense` : `income`
              // focus on the amount input
              document.getElementById(`amount`).focus()
            }
          })
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
    </div>

    <div class="flex items-center justify-center gap-2">
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
          class="px-1 py-1"
          color="green"
          variant={$form[`transactionType`] === `income` ? `secondary` : `ghost`}
          on:click={() => {
            $form[`transactionType`] = `income`
          }}
        >
          INCOME
          {#if $form[`transactionType`] === `income`}
            <CheckIcon />
          {/if}
        </Button>
        <Button
          size="sm"
          class="px-1 py-1"
          color="red"
          variant={$form[`transactionType`] === `expense` ? `secondary` : `ghost`}
          on:click={() => {
            $form[`transactionType`] = `expense`
          }}
        >
          EXPENSE
          {#if $form[`transactionType`] === `expense`}
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
