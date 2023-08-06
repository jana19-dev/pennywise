<script>
  import { LoadingAlert, ErrorAlert } from "$lib/components/ui"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableMetrics from "$lib/components/table/TableMetrics.svelte"

  import AccountTypeHeader from "$lib/components/application/accountType/table/AccountTypeHeader.svelte"
  import AccountTypeRow from "$lib/components/application/accountType/table/AccountTypeRow.svelte"

  import { createInfiniteQuery } from "@tanstack/svelte-query"
  import { GET_ALL_ACCOUNT_TYPES } from "$lib/graphql/client/accountType/queries"
  import { QUERY_LIMIT } from "$lib/utils/constants"

  import { page } from "$app/stores"
  import { buildSort } from "$lib/utils/client/sort"

  $: orderBy = buildSort({
    orderByParam: $page.url.searchParams.get(`orderBy`),
    allowedKeys: [`name`, `priority`],
    defaultOrderBy: { priority: `asc` }
  })
  $: search = $page.url.searchParams.get(`search`) || ``
  $: searchField = $page.url.searchParams.get(`searchField`) || ``
  $: subSearchField = $page.url.searchParams.get(`subSearchField`) || ``

  $: queryResult = createInfiniteQuery(
    [
      `GET_ALL_ACCOUNT_TYPES`,
      {
        orderBy,
        search,
        searchField: search ? searchField : ``,
        subSearchField: search ? subSearchField : ``
      }
    ],

    GET_ALL_ACCOUNT_TYPES,
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
  <h1 class="hidden text-center text-xl font-medium leading-6 text-gray-900 sm:truncate lg:flex">
    {$page.data?.title || ``}
  </h1>
</TableMetrics>

<div class="h-full overflow-y-auto p-2 pt-0" class:pointer-events-none={$queryResult.isLoading}>
  <TableWrapper>
    <tr slot="header">
      <AccountTypeHeader />
    </tr>
    {#each allData as accountType (accountType.id)}
      <AccountTypeRow {accountType} />
    {:else}
      <tr>
        <td colspan="100%">
          {#if $queryResult.isLoading}
            <LoadingAlert>Loading account types ...</LoadingAlert>
          {:else if $queryResult.isError}
            <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
          {:else}
            <ErrorAlert>
              No <strong>account types</strong>
              found
              {#if search && searchField}
                with
                <strong>{searchField}{subSearchField && `->${subSearchField}`}</strong>
                having
                <strong>{search}</strong>
              {/if}
            </ErrorAlert>
          {/if}
        </td>
      </tr>
    {/each}
  </TableWrapper>
</div>
