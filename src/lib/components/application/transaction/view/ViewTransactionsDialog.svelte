<script>
  export let context

  import { onMount } from "svelte"

  import { Dialog, LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"
  import CloseButton from "$lib/components/ui/CloseButton.svelte"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableCell from "$lib/components/table/TableCell.svelte"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_MONTHLY_TRANSACTIONS } from "$lib/graphql/client/transaction/queries"

  import UpdateTransactionDate from "$lib/components/application/transaction/mutations/update/UpdateTransactionDate.svelte"
  import UpdateTransactionAccount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAccount.svelte"
  import UpdateTransactionCategory from "$lib/components/application/transaction/mutations/update/UpdateTransactionCategory.svelte"
  import UpdateTransactionPayee from "$lib/components/application/transaction/mutations/update/UpdateTransactionPayee.svelte"
  import UpdateTransactionAmount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAmount.svelte"
  import UpdateTransactionMemo from "$lib/components/application/transaction/mutations/update/UpdateTransactionMemo.svelte"

  const queryResult = createQuery([`GET_MONTHLY_TRANSACTIONS`, context], GET_MONTHLY_TRANSACTIONS)

  let dialog

  onMount(() => {
    dialog.show()
  })

  $: allData = $queryResult.data?.data || []
  $: metrics = $queryResult.data?.metrics || {}
</script>

<Dialog bind:dialog closeOnOverlayClick on:close size="5xl" class="py-0 pb-4">
  <div slot="header" class="flex items-center justify-between gap-2">
    <div class="flex items-center gap-2">
      <p class="text-lg text-blue-800">
        <span class="font-semibold">{metrics.allCount}</span>
      </p>
      <h2 class=" font-medium text-gray-900">Transactions</h2>

      <CurrencyView amount={metrics.sum} size="lg" />
    </div>
    {#each Object.entries(context) as [key, value]}
      <div class="flex items-center">
        <span
          class="inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium uppercase text-gray-800"
          >{key}:</span
        >
        <span
          class="inline-flex items-center rounded-md bg-yellow-100 px-2.5 py-0.5 text-sm font-medium uppercase text-yellow-800"
          >{value}</span
        >
      </div>
    {/each}
    <CloseButton on:click={dialog.hide} />
  </div>

  <div slot="content">
    <TableWrapper>
      <tr slot="header">
        <TableHeaderCell>
          <div class="min-w-[7rem]">Date</div>
        </TableHeaderCell>
        <TableHeaderCell>Account</TableHeaderCell>
        <TableHeaderCell>Category</TableHeaderCell>
        <TableHeaderCell>Payee</TableHeaderCell>
        <TableHeaderCell>Memo</TableHeaderCell>
        <TableHeaderCell>
          <div class="text-center">Amount</div>
        </TableHeaderCell>
      </tr>
      {#each allData as transaction (transaction.id)}
        <tr class="h-10" class:bg-yellow-100={new Date(transaction.date) > new Date()}>
          <TableCell>
            <UpdateTransactionDate {transaction} isInline />
          </TableCell>
          <TableCell>
            <UpdateTransactionAccount {transaction} isInline />
          </TableCell>
          {#if transaction.transferTo}
            <TableCell>
              <span
                >TRANSFER {#if transaction.amount > 0} FROM {:else} TO {/if}</span
              >
            </TableCell>
            <TableCell>
              {transaction.transferTo.account.name}
            </TableCell>
          {:else if !transaction.transferTo && !transaction.payee && !transaction.category}
            <TableCell colspan={2}>
              <div class="font-semibold">
                <span
                  class="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800"
                  >Opening Balance</span
                >
              </div>
            </TableCell>
          {:else}
            <TableCell>
              <UpdateTransactionCategory {transaction} isInline />
            </TableCell>
            <TableCell>
              <UpdateTransactionPayee {transaction} isInline />
            </TableCell>
          {/if}
          <TableCell>
            <UpdateTransactionMemo {transaction} isInline />
          </TableCell>
          <TableCell>
            <UpdateTransactionAmount {transaction} isInline />
          </TableCell>
        </tr>
      {:else}
        <tr>
          <td colspan="100%">
            {#if $queryResult.isLoading}
              <LoadingAlert>Loading transactions ...</LoadingAlert>
            {:else if $queryResult.isError}
              <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
            {:else}
              <ErrorAlert>No <strong>transactions</strong> found</ErrorAlert>
            {/if}
          </td>
        </tr>
      {/each}
    </TableWrapper>
  </div>
</Dialog>
