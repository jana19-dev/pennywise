<script>
  export let accountType

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteAccountType from "$lib/components/application/accountType/mutations/DeleteAccountType.svelte"
  import UpdateAccountTypeName from "$lib/components/application/accountType/mutations/update/UpdateAccountTypeName.svelte"
  import UpdateAccountTypePriority from "$lib/components/application/accountType/mutations/update/UpdateAccountTypePriority.svelte"
  import AccountTypeAccounts from "$lib/components/application/accountType/table/AccountTypeAccounts.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeleteAccountType {accountType} />
  </TableCell>
  <TableCell>
    <UpdateAccountTypeName {accountType} isInline />
  </TableCell>
  <TableCell>
    <UpdateAccountTypePriority {accountType} isInline />
  </TableCell>
  <TableCell>
    <AccountTypeAccounts {accountType} />
  </TableCell>
</tr>
