<script>
  export let transaction
  export let isInline = false

  import { Button } from "@codepiercer/svelte-tailwind"
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte"

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_TRANSACTION_AMOUNT } from "$lib/graphql/client/transaction/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"
  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  const queryClient = useQueryClient()

  let dialog

  let isIncome = transaction.amount >= 0
  const updateTransactionAmountMutation = createMutation(UPDATE_TRANSACTION_AMOUNT, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_TRANSACTION_AMOUNT`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
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
          .required()
      }),
      initialValues: {
        amount: transaction.amount >= 0 ? transaction.amount : transaction.amount * -1
      },
      onSubmit: ({ amount }) => {
        $updateTransactionAmountMutation.mutate({
          id: transaction.id,
          amount: isIncome ? parseFloat(amount) : parseFloat(amount) * -1
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateTransactionAmountMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      amount: transaction.amount >= 0 ? transaction.amount : transaction.amount * -1
    })
    isIncome = transaction.amount >= 0
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  type="number"
  inputProps={{ step: 0.01, min: 0 }}
  name="amount"
  label="Amount"
  value={transaction.amount >= 0 ? transaction.amount : transaction.amount * -1}
  error={$errors[`amount`]}
  serverError={$updateTransactionAmountMutation.error?.message}
  isTouched={$touched[`amount`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateTransactionAmountMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs flex w-full justify-end"
>
  <div class="">
    <CurrencyView amount={transaction.amount} />
  </div>
  <div slot="info">
    <div class="mt-4 flex w-fit items-center gap-2">
      {#if !transaction.transferTo}
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
      {/if}
      {#if transaction.transferTo}
        <Button size="sm" color="blue" variant="secondary" class="pointer-events-none"
          >Transfer
          {#if isIncome} from: {:else} to: {/if}
          {#if isIncome}
            {transaction.account.name}
          {:else}
            {transaction.transferTo.account.name}
          {/if}
        </Button>
      {/if}
    </div>
  </div>
</TextEditDialog>
