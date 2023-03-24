<script>
  export let account

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteAccount from "$lib/components/application/account/mutations/DeleteAccount.svelte"
  import UpdateAccountName from "$lib/components/application/account/mutations/update/UpdateAccountName.svelte"
  import UpdateAccountType from "$lib/components/application/account/mutations/update/UpdateAccountType.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeleteAccount {account} />
  </TableCell>
  <TableCell>
    <UpdateAccountName {account} isInline />
  </TableCell>
  <TableCell>
    <UpdateAccountType {account} isInline />
  </TableCell>
</tr>
