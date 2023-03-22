<script>
  export let selectedAccountTypes
  export let allData

  import { Dialog, Button } from "@codepiercer/svelte-tailwind"

  import ActiveIndicator from "$lib/components/ui/ActiveIndicator.svelte"
  import CloseButton from "$lib/components/ui/CloseButton.svelte"

  import DeleteAccountTypes from "$lib/components/application/accountType/mutations/DeleteAccountTypes.svelte"

  let dialog

  const onSelectAll = () => {
    selectedAccountTypes = allData.reduce((acc, accountType) => {
      acc[accountType.id] = accountType
      return acc
    }, {})
  }

  const onClearSelection = () => {
    selectedAccountTypes = {}
  }

  $: if (dialog && Object.keys(selectedAccountTypes).length === 0) {
    dialog.hide()
  }
</script>

<Button
  slot="trigger"
  on:click={dialog.show}
  color="yellow"
  variant="secondary"
  class="relative mx-1 p-1 lg:p-2"
>
  <span class="min-w-0 items-center justify-between lg:flex">
    <span
      class="mr-2 inline-flex rounded-full bg-orange-200 px-2 text-xs font-semibold leading-5 text-orange-900"
      >{Object.keys(selectedAccountTypes).length}</span
    >
    <span class="">Selected</span>
  </span>
  <ActiveIndicator />
</Button>

<Dialog bind:dialog size="lg" closeOnOverlayClick>
  <div slot="header" class="flex items-start justify-between">
    <h2 class="flex items-center text-xl font-semibold text-gray-900">
      <span
        class="mr-2 inline-flex rounded-md bg-orange-200 px-3 py-1 text-sm font-semibold leading-5 text-orange-900"
        >{Object.keys(selectedAccountTypes).length}</span
      > Account Types Selected
    </h2>
    <CloseButton on:click={dialog.hide} />
  </div>

  <div slot="content" class="flex flex-col gap-4">
    <div class="-mt-4 flex max-h-20 flex-wrap gap-2 overflow-y-auto">
      {#each Object.values(selectedAccountTypes) as accountType (accountType.id)}
        <p class="inline-block rounded-md bg-orange-100 p-1 px-2">{accountType.name}</p>
      {/each}
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Delete Account Types</h3>
        <div class="mt-2 sm:flex sm:items-start sm:justify-between">
          <div class="max-w-xl text-xs text-gray-500">
            <p>
              Deleting account types will remove them from the system. This action cannot be undone.
            </p>
          </div>
          <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <DeleteAccountTypes bind:selectedAccountTypes />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div slot="footer" class="flex flex-col gap-4">
    <div class="flex justify-between gap-4">
      <Button on:click={onSelectAll} variant="outlined" color="yellow"
        >Select all {allData.length}</Button
      >
      <Button on:click={onClearSelection} variant="outlined">Clear selection</Button>
    </div>
  </div>
</Dialog>
