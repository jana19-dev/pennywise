<script>
  export let account
  export let isInline = false

  import { createForm } from "svelte-forms-lib"
  import * as yup from "yup"

  import { createMutation, useQueryClient } from "@tanstack/svelte-query"
  import { UPDATE_ACCOUNT_STARTING_BALANCE } from "$lib/graphql/client/account/mutations"
  import { INVALIDATE_QUERIES_FROM_MUTATION } from "$lib/utils/client/cacheInvalidation"
  import toast from "$lib/utils/client/toast"

  import { TextEditDialog } from "@codepiercer/svelte-tailwind"
  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  const queryClient = useQueryClient()

  let dialog

  const updateAccountStartingBalanceMutation = createMutation(UPDATE_ACCOUNT_STARTING_BALANCE, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          INVALIDATE_QUERIES_FROM_MUTATION[`UPDATE_ACCOUNT_STARTING_BALANCE`].includes(queryKey[0])
      })
      toast.success(`Successfully updated`)
      setTimeout(onClose)
    }
  })

  const { errors, touched, handleChange, handleSubmit, handleReset, updateInitialValues } =
    createForm({
      validationSchema: yup.object().shape({
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
        startingBalance: account.startingBalance
      },
      onSubmit: ({ startingBalance }) => {
        $updateAccountStartingBalanceMutation.mutate({
          id: account.id,
          startingBalance: parseFloat(startingBalance)
        })
      }
    })

  const onClose = () => {
    handleReset()
    $updateAccountStartingBalanceMutation.reset()
    dialog.hide()
  }

  $: {
    updateInitialValues({
      startingBalance: account.startingBalance
    })
  }
</script>

<TextEditDialog
  bind:dialog
  isRequired
  {isInline}
  type="number"
  inputProps={{ step: 0.01 }}
  name="startingBalance"
  label="Starting Balance"
  value={account.startingBalance}
  error={$errors[`startingBalance`]}
  serverError={$updateAccountStartingBalanceMutation.error?.message}
  isTouched={$touched[`startingBalance`]}
  on:change={handleChange}
  on:keyup={handleChange}
  isLoading={$updateAccountStartingBalanceMutation.isLoading}
  on:submit={handleSubmit}
  on:close={onClose}
  displayClass="text-xs"
>
  <div class="mx-auto">
    <CurrencyView amount={account.startingBalance} />
  </div>
</TextEditDialog>
