<script>
  export let transaction
  export let isLastItem = false
  export let queryResult

  import { page } from "$app/stores"

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteTransaction from "$lib/components/application/transaction/mutations/DeleteTransaction.svelte"
  import UpdateTransactionDate from "$lib/components/application/transaction/mutations/update/UpdateTransactionDate.svelte"
  import UpdateTransactionAccount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAccount.svelte"
  import UpdateTransactionCategory from "$lib/components/application/transaction/mutations/update/UpdateTransactionCategory.svelte"
  import UpdateTransactionPayee from "$lib/components/application/transaction/mutations/update/UpdateTransactionPayee.svelte"
  import UpdateTransactionAmount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAmount.svelte"
  import UpdateTransactionMemo from "$lib/components/application/transaction/mutations/update/UpdateTransactionMemo.svelte"

  function actionWhenInViewport(e) {
    const observer = new IntersectionObserver((entries) => {
      if (!isLastItem) {
        observer.unobserve(e)
      }
      if (entries[0].isIntersecting) {
        // element in viewport
        if (!isLastItem) {
          observer.unobserve(e)
        }
        isLastItem && $queryResult.fetchNextPage()
      }
    })
    if (!isLastItem) {
      observer.unobserve(e)
    } else {
      observer.observe(e)
    }
  }
</script>

<tr class="h-10" use:actionWhenInViewport>
  <TableCell>
    <DeleteTransaction {transaction} />
  </TableCell>
  <TableCell>
    <UpdateTransactionDate {transaction} isInline />
  </TableCell>
  {#if !$page.params.accountId}
    <TableCell>
      <UpdateTransactionAccount {transaction} isInline />
    </TableCell>
  {/if}
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
