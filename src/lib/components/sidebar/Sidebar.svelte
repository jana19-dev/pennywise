<script>
  import { isSidebarOpenStore } from "$lib/stores"
  import { afterNavigate } from "$app/navigation"

  import { Button, LoadingAlert, ErrorAlert } from "$lib/components/ui"

  import SidebarLink from "$lib/components/sidebar/SidebarLink.svelte"
  import SidebarFooter from "$lib/components/sidebar/SidebarFooter.svelte"
  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_ACCOUNT_TYPES_LEAN } from "$lib/graphql/client/accountType/queries"

  const accountTypesQueryResult = createQuery([`GET_ALL_ACCOUNT_TYPES_LEAN`], GET_ALL_ACCOUNT_TYPES_LEAN)

  afterNavigate(() => {
    $isSidebarOpenStore = false
  })
</script>

<div
  class:block={$isSidebarOpenStore}
  class:hidden={!$isSidebarOpenStore}
  class="fixed inset-0 z-20 opacity-50 transition-opacity lg:hidden"
  on:click={() => ($isSidebarOpenStore = false)}
  on:keyup={() => ($isSidebarOpenStore = false)}
  role="button"
  tabindex="0"
/>
<div
  class:translate-x-0={$isSidebarOpenStore}
  class:-translate-x-full={!$isSidebarOpenStore}
  class:ease-out={$isSidebarOpenStore}
  class:ease-in={!$isSidebarOpenStore}
  class="fixed inset-y-0 left-0 z-30 flex w-64 transform flex-col bg-gray-900 transition duration-300 lg:static lg:inset-0 lg:translate-x-0"
>
  <div class=" flex items-center justify-center">
    <Button href="/" variant="ghost" class="m-1 mx-2 w-full p-1 hover:!bg-gray-700">
      <img src="/logo.png" alt="PennyWise logo" class="h-8 w-8" />
      <h1 class="ml-2 text-xl font-semibold tracking-tight text-gray-50">PennyWise</h1>
    </Button>
  </div>

  <nav class="flex h-full flex-col overflow-y-auto px-1">
    <div class="flex flex-1 overflow-y-auto">
      {#if $accountTypesQueryResult.isLoading}
        <div class="w-full">
          <LoadingAlert>Loading accounts ...</LoadingAlert>
        </div>
      {:else if $accountTypesQueryResult.isError}
        <div class="w-full">
          <ErrorAlert>Error: {$accountTypesQueryResult.error.message}</ErrorAlert>
        </div>
      {:else}
        <div class="flex flex-1 flex-col gap-2 px-1">
          {#each $accountTypesQueryResult.data as accountType (accountType.id)}
            {#if accountType.accounts.length > 0}
              <span
                class="inline-flex w-fit items-center rounded bg-yellow-600/40 px-2 py-0.5 text-xs font-medium text-white"
              >
                {accountType.name}
              </span>
              {#each accountType.accounts as account (account.id)}
                {#if account.balance != 0}
                  <div class="flex items-center">
                    <SidebarLink
                      color="indigo"
                      link={{
                        label: account.name,
                        href: `/transactions/${account.id}`
                      }}
                    >
                      <CurrencyView amount={account.balance} isSidebar />
                    </SidebarLink>
                  </div>
                {/if}
              {/each}
            {/if}
          {/each}
        </div>
      {/if}
    </div>
    <SidebarFooter />
  </nav>
</div>
