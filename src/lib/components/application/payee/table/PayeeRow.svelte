<script>
  export let payee

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeletePayee from "$lib/components/application/payee/mutations/DeletePayee.svelte"
  import UpdatePayeeName from "$lib/components/application/payee/mutations/update/UpdatePayeeName.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeletePayee {payee} />
  </TableCell>
  <TableCell>
    <UpdatePayeeName {payee} isInline />
  </TableCell>
</tr>
