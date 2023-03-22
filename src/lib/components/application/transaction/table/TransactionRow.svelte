<script>
  export let transaction

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteTransaction from "$lib/components/application/transaction/mutations/DeleteTransaction.svelte"
  import UpdateTransactionDate from "$lib/components/application/transaction/mutations/update/UpdateTransactionDate.svelte"
  import UpdateTransactionAccount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAccount.svelte"
  import UpdateTransactionCategory from "$lib/components/application/transaction/mutations/update/UpdateTransactionCategory.svelte"
  import UpdateTransactionPayee from "$lib/components/application/transaction/mutations/update/UpdateTransactionPayee.svelte"
  import UpdateTransactionAmount from "$lib/components/application/transaction/mutations/update/UpdateTransactionAmount.svelte"
  import UpdateTransactionMemo from "$lib/components/application/transaction/mutations/update/UpdateTransactionMemo.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeleteTransaction {transaction} />
  </TableCell>
  <TableCell>
    <UpdateTransactionDate {transaction} isInline />
  </TableCell>
  <TableCell>
    <UpdateTransactionAccount {transaction} isInline />
  </TableCell>
  <TableCell>
    <UpdateTransactionCategory {transaction} isInline />
  </TableCell>
  <TableCell>
    <UpdateTransactionPayee {transaction} isInline />
  </TableCell>
  <TableCell>
    <UpdateTransactionMemo {transaction} isInline />
  </TableCell>
  <TableCell>
    <UpdateTransactionAmount {transaction} isInline />
  </TableCell>
</tr>
