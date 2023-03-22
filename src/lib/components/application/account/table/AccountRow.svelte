<script>
  export let account

  import TableCell from "$lib/components/table/TableCell.svelte"
  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import DeleteAccount from "$lib/components/application/account/mutations/DeleteAccount.svelte"
  import UpdateAccountName from "$lib/components/application/account/mutations/update/UpdateAccountName.svelte"
  import UpdateAccountType from "$lib/components/application/account/mutations/update/UpdateAccountType.svelte"
  import UpdateAccountStartingDate from "$lib/components/application/account/mutations/update/UpdateAccountStartingDate.svelte"
  import UpdateAccountStartingBalance from "$lib/components/application/account/mutations/update/UpdateAccountStartingBalance.svelte"
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
  <TableCell>
    <UpdateAccountStartingDate {account} isInline />
  </TableCell>
  <TableCell>
    <UpdateAccountStartingBalance {account} isInline />
  </TableCell>
  <TableCell>
    <div class="text-right">
      <CurrencyView amount={account.balance} />
    </div>
  </TableCell>
</tr>
