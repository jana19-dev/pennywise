<script>
  export let accountType

  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteAccountType from "$lib/components/application/accountType/mutations/DeleteAccountType.svelte"
  import EditAccountTypeName from "$lib/components/application/accountType/mutations/update/EditAccountTypeName.svelte"
  import EditAccountTypePriority from "$lib/components/application/accountType/mutations/update/EditAccountTypePriority.svelte"
</script>

<tr class="h-10">
  <TableCell>
    <DeleteAccountType {accountType} />
  </TableCell>
  <TableCell>
    <EditAccountTypeName {accountType} isInline />
  </TableCell>
  <TableCell>
    <EditAccountTypePriority {accountType} isInline />
  </TableCell>
</tr>
