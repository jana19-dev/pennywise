<script>
  export let accountType

  import { Button } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"

  import TableCellCountBadge from "$lib/components/table/TableCellCountBadge.svelte"

  import ViewAccountTypeAccountsDialog from "$lib/components/application/accountType/views/ViewAccountTypeAccountsDialog.svelte"
  import CreateAccount from "$lib/components/application/account/mutations/CreateAccount.svelte"

  let viewDialog
  let createDialog
</script>

<div class="inline-flex w-full items-center justify-between">
  <div class="flex items-center gap-2">
    <Button
      isDisabled={accountType.accounts.length === 0}
      class="p-0"
      variant="secondary"
      color="green"
      on:click={viewDialog.show}
    >
      <div class="flex items-center">
        <TableCellCountBadge count={accountType.accounts.length} />
      </div>
    </Button>
    <span class="max-w-[12rem] truncate text-ellipsis text-xs">
      Account{accountType.accounts.length > 1 ? `s` : ``}
    </span>
  </div>
  <Button on:click={createDialog.show} variant="outlined" class="p-0" color="gray">
    <span class="sr-only">Crate new</span>
    <PlusIcon class="text-gray-400" />
  </Button>
</div>

<ViewAccountTypeAccountsDialog bind:dialog={viewDialog} {accountType} />
<CreateAccount bind:dialog={createDialog} {accountType} />
