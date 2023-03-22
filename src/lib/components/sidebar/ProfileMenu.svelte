<script>
  import { page } from "$app/stores"

  import { Dialog, Button, LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_USER_OVERVIEW } from "$lib/graphql/client/auth/queries"

  const userOverviewQueryResult = createQuery([`GET_USER_OVERVIEW`], GET_USER_OVERVIEW)

  let dialog
</script>

<Button
  on:click={dialog.show}
  color="blue"
  variant="ghost"
  class="my-1 w-full justify-between gap-2 !bg-blue-900 px-4"
>
  <img
    class="inline-block h-8 w-8 rounded-full"
    src={$page.data.session.user.image}
    alt={$page.data.session.user.name}
  />
  <span class="flex flex-col gap-1 text-right text-xs">
    <p class="text-md font-semibold text-gray-50">
      {$page.data.session.user.name}
    </p>
    <p class=" font-medium text-gray-300">
      {$page.data.session.user.email}
    </p>
  </span>
</Button>

<Dialog bind:dialog closeOnOverlayClick size="sm">
  <div slot="content">
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <h2 class="sr-only" id="user-overview-title">User Overview</h2>
      <div class="bg-white p-6">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div class="sm:flex sm:space-x-5">
            <div class="flex-shrink-0">
              <img
                class="mx-auto h-20 w-20 rounded-full"
                src={$page.data.session.user.image}
                alt={$page.data.session.user.name}
              />
            </div>
            <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p class="text-xl font-bold text-gray-900 sm:text-2xl">
                {$page.data.session.user.name}
              </p>
              <p class="text-sm font-medium text-gray-600">{$page.data.session.user.email}</p>
            </div>
          </div>
        </div>
      </div>
      {#if $userOverviewQueryResult.isLoading}
        <div class="w-full">
          <LoadingAlert>Loading overview ...</LoadingAlert>
        </div>
      {:else if $userOverviewQueryResult.isError}
        <div class="w-full">
          <ErrorAlert>Error: {$userOverviewQueryResult.error.message}</ErrorAlert>
        </div>
      {:else}
        <div class="grid divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 px-2">
          <div class="flex items-center justify-between px-6 py-5 text-center text-sm font-medium">
            <span class="text-lg text-gray-900">{$userOverviewQueryResult.data.accounts}</span>
            <span class="text-gray-600">Accounts</span>
          </div>

          <div class="flex items-center justify-between px-6 py-5 text-center text-sm font-medium">
            <span class="text-lg text-gray-900">{$userOverviewQueryResult.data.categories}</span>
            <span class="text-gray-600">Categories</span>
          </div>

          <div class="flex items-center justify-between px-6 py-5 text-center text-sm font-medium">
            <span class="text-lg text-gray-900">{$userOverviewQueryResult.data.payees}</span>
            <span class="text-gray-600">Payees</span>
          </div>

          <div class="flex items-center justify-between px-6 py-5 text-center text-sm font-medium">
            <span class="text-lg text-gray-900">{$userOverviewQueryResult.data.transactions}</span>
            <span class="text-gray-600">Transactions</span>
          </div>

          <div
            class="flex items-center justify-between px-16 py-5 text-center text-sm font-medium "
          >
            <span class="text-gray-600">Net Worth</span>
            <CurrencyView amount={$userOverviewQueryResult.data.netWorth} size="lg" />
          </div>
        </div>
      {/if}
    </div>
  </div>

  <div slot="footer" class="flex justify-end">
    <Button href="/logout" data-sveltekit-preload-data="tap" color="red" class="gap-2 px-4">
      Logout
    </Button>
  </div></Dialog
>
