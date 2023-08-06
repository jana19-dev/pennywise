<script>
  import { page } from "$app/stores"
  import { browser } from "$app/environment"

  import { Button, FormDialog, TextInput, DateInput } from "$lib/components/ui"
  import SwitchIcon from "$lib/components/icons/SwitchIcon.svelte"

  import SelectAccountInput from "$lib/components/select/SelectAccountInput.svelte"

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

  $: queryResult = createQuery(
    [
      `GET_RECENT_TRANSACTION`,
      {
        payeeId: $page.params.accountId,
        isTransfer: true
      }
    ],
    GET_RECENT_TRANSACTION,
    {
      enabled: !!$page.params.accountId && !!browser
    }
  )

  const createTransactionMutation = createMutation(CREATE_TRANSACTION, {
    onSuccess: () => {
      toast.success(`Successfully created the transaction`)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) => INVALIDATE_QUERIES_FROM_MUTATION[`CREATE_TRANSACTION`].includes(queryKey[0])
      })
      setTimeout(onClose)
    }
  })

  const { form, errors, touched, handleChange, handleSubmit } = createForm({
    validationSchema: yup.object().shape({
      date: yup.string().required(),
      accountId: yup.string().required(),
      transferAccountId: yup.string(),
      amount: yup
        .number()
        .typeError(`The amount should be a positive number with maximum two digits of decimal places`)
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
      transferAccountId: undefined,
      amount: undefined
    },
    onSubmit: ({ date, accountId, transferAccountId, amount, memo }) => {
      $createTransactionMutation.mutate({
        date: formatDate(date),
        accountId,
        transferAccountId,
        amount: parseFloat(amount) * -1,
        memo
      })
    }
  })

  $: if ($page.params.accountId) {
    $form[`transferAccountId`] = undefined
    $form[`accountId`] = $page.params.accountId
    if ($queryResult.data) {
      if ($queryResult.data?.accountId !== $page.params.accountId && $queryResult.data.amount > 0) {
        $form[`accountId`] = $page.params.accountId
        $form[`transferAccountId`] = $queryResult.data?.accountId
      } else {
        $form[`transferAccountId`] = $page.params.accountId
        $form[`accountId`] = $queryResult.data?.accountId
      }
    } else {
      $form[`transferAccountId`] = undefined
      $form[`accountId`] = $page.params.accountId
    }
  }

  const onClose = () => {
    $form[`date`] = new Date()
    $form[`amount`] = undefined
    $form[`memo`] = undefined
    $createTransactionMutation.reset()
    dialog.hide()
  }
</script>

<Button on:click={dialog.show} class="px-2" variant="secondary"><SwitchIcon /></Button>

<FormDialog
  bind:dialog
  size="lg"
  title="Create a new transfer"
  error={$createTransactionMutation?.error?.message}
  isLoading={$createTransactionMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  initialFocusID="amount"
  class="min-h-[21rem]"
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

    <div class="flex items-center justify-between gap-2">
      <SelectAccountInput
        isRequired
        name="accountId"
        label="From Account"
        value={$form[`accountId`] || ``}
        error={$errors[`accountId`]}
        on:select={({ detail }) => {
          $form[`accountId`] = detail.option.value
        }}
      />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
        <path
          fill-rule="evenodd"
          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
          clip-rule="evenodd"
        />
      </svg>
      <SelectAccountInput
        isRequired
        name="transferAccountId"
        label="To Account"
        value={$form[`transferAccountId`] || ``}
        error={$errors[`transferAccountId`]}
        on:select={({ detail }) => {
          $form[`transferAccountId`] = detail.option.value
        }}
      />
    </div>

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
