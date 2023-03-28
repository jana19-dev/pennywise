<script>
  import { LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableMetrics from "$lib/components/table/TableMetrics.svelte"

  import TransactionHeader from "$lib/components/application/transaction/table/TransactionHeader.svelte"
  import TransactionRow from "$lib/components/application/transaction/table/TransactionRow.svelte"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import { createInfiniteQuery } from "@tanstack/svelte-query"
  import { GET_ACCOUNT_TRANSACTIONS } from "$lib/graphql/client/transaction/queries"
  import { QUERY_LIMIT } from "$lib/utils/constants"

  import { page } from "$app/stores"
  import { buildSort } from "$lib/utils/client/sort"

  $: orderBy = buildSort({
    orderByParam: $page.url.searchParams.get(`orderBy`),
    allowedKeys: [`date`, `amount`],
    defaultOrderBy: { date: `desc` }
  })
  $: search = $page.url.searchParams.get(`search`) || ``
  $: searchField = $page.url.searchParams.get(`searchField`) || ``
  $: subSearchField = $page.url.searchParams.get(`subSearchField`) || ``

  $: queryResult = createInfiniteQuery(
    [
      `GET_ACCOUNT_TRANSACTIONS`,
      {
        accountId: $page.params.accountId,
        orderBy,
        search,
        searchField: search ? searchField : ``,
        subSearchField: search ? subSearchField : ``
      }
    ],

    GET_ACCOUNT_TRANSACTIONS,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.data.length < QUERY_LIMIT) {
          return undefined
        }
        return lastPage.data.length + lastPage.metrics.skip
      }
    }
  )

  $: allData = $queryResult.data?.pages?.map(({ data }) => data).flat() || []
  $: metrics = $queryResult.data?.pages[0]?.metrics || {}
</script>

<TableMetrics {metrics} count={allData.length} {queryResult}>
  <div class="flex items-center gap-2">
    <h1 class="hidden text-xl font-medium leading-6 text-gray-900 sm:truncate lg:flex">
      {$page.data?.title || ``}
    </h1>
    {#if metrics.filteredSum}
      <CurrencyView amount={metrics.filteredSum} size="lg" />
    {/if}
  </div>
</TableMetrics>

<div class="h-full overflow-y-auto p-2 pt-0" class:pointer-events-none={$queryResult.isLoading}>
  <TableWrapper>
    <tr slot="header">
      <TransactionHeader />
    </tr>
    {#each allData as transaction, index (transaction.id)}
      <TransactionRow {transaction} isLastItem={allData.length === index + 1} {queryResult} />
    {:else}
      <tr>
        <td colspan="100%">
          {#if $queryResult.isLoading}
            <LoadingAlert>Loading transactions ...</LoadingAlert>
          {:else if $queryResult.isError}
            <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
          {:else}
            <ErrorAlert
              >No <strong>transactions</strong> found
              {#if search && searchField}
                with
                <strong>{searchField}{subSearchField && `->${subSearchField}`} </strong>
                having <strong>{search} </strong>
              {/if}
            </ErrorAlert>
          {/if}
        </td>
      </tr>
    {/each}
  </TableWrapper>
</div>
