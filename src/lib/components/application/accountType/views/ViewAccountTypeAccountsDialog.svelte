<script>
  export let accountType
  export let dialog

  import { SvelteToast } from "@zerodevx/svelte-toast"

  import { Dialog } from "@codepiercer/svelte-tailwind"

  import CloseButton from "$lib/components/ui/CloseButton.svelte"
  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableCell from "$lib/components/table/TableCell.svelte"

  import DeleteAccount from "$lib/components/application/account/mutations/DeleteAccount.svelte"
  import UpdateAccountName from "$lib/components/application/account/mutations/update/UpdateAccountName.svelte"
  import UpdateAccountStartingDate from "$lib/components/application/account/mutations/update/UpdateAccountStartingDate.svelte"
  import UpdateAccountStartingBalance from "$lib/components/application/account/mutations/update/UpdateAccountStartingBalance.svelte"
</script>

<Dialog bind:dialog size="xl" closeOnOverlayClick class="pt-0">
  <div slot="header" class="flex items-start justify-between">
    <h2 class="text-xl font-semibold text-gray-900">{accountType.name} Accounts</h2>
    <CloseButton on:click={dialog.hide} />
  </div>

  <div slot="content">
    <SvelteToast />
    <TableWrapper>
      <tr slot="header">
        <TableHeaderCell />
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell><div class="min-w-[7rem]">Starting Date</div></TableHeaderCell>
        <TableHeaderCell>Starting Balance</TableHeaderCell>
      </tr>
      {#each accountType.accounts as account (account.id)}
        <tr class="h-10">
          <TableCell>
            <DeleteAccount {account} />
          </TableCell>
          <TableCell>
            <UpdateAccountName {account} isInline />
          </TableCell>
          <TableCell>
            <UpdateAccountStartingDate {account} isInline />
          </TableCell>
          <TableCell>
            <UpdateAccountStartingBalance {account} isInline />
          </TableCell>
        </tr>
      {/each}
    </TableWrapper>
  </div>
</Dialog>
