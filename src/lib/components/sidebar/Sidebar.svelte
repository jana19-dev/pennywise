<script>
  import { isSidebarOpenStore } from "$lib/stores"
  import { afterNavigate } from "$app/navigation"

  import { Button, LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import SidebarLink from "$lib/components/sidebar/SidebarLink.svelte"
  import SidebarFooter from "$lib/components/sidebar/SidebarFooter.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_ACCOUNT_TYPES_LEAN } from "$lib/graphql/client/accountType/queries"

  const accountTypesQueryResult = createQuery(
    [`GET_ALL_ACCOUNT_TYPES_LEAN`],
    GET_ALL_ACCOUNT_TYPES_LEAN
  )

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
                >{accountType.name}</span
              >
              {#each accountType.accounts as account (account.id)}
                <div class="flex items-center">
                  <SidebarLink
                    color="indigo"
                    link={{
                      label: account.name,
                      href: `/transactions/${account.id}`,
                      iconPaths: [
                        `M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z`
                      ]
                    }}
                  >
                    <div
                      class="inline-flex rounded-md px-2 text-xs font-semibold tabular-nums leading-5"
                      class:bg-green-100={account.balance >= 0}
                      class:text-green-800={account.balance >= 0}
                      class:bg-red-100={account.balance < 0}
                      class:text-red-800={account.balance < 0}
                    >
                      {account.balance}
                    </div>
                  </SidebarLink>
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      {/if}
    </div>
    <SidebarFooter />
  </nav>
</div>
