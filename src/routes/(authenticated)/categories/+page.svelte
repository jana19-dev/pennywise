<script>
  import { LoadingAlert, ErrorAlert } from "$lib/components/ui"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableMetrics from "$lib/components/table/TableMetrics.svelte"

  import CategoryHeader from "$lib/components/application/category/table/CategoryHeader.svelte"
  import CategoryRow from "$lib/components/application/category/table/CategoryRow.svelte"

  import { createInfiniteQuery } from "@tanstack/svelte-query"
  import { GET_ALL_CATEGORIES } from "$lib/graphql/client/category/queries"
  import { QUERY_LIMIT } from "$lib/utils/constants"

  import { page } from "$app/stores"
  import { buildSort } from "$lib/utils/client/sort"

  $: orderBy = buildSort({
    orderByParam: $page.url.searchParams.get(`orderBy`),
    allowedKeys: [`name`],
    defaultOrderBy: { name: `asc` }
  })
  $: search = $page.url.searchParams.get(`search`) || ``
  $: searchField = $page.url.searchParams.get(`searchField`) || ``
  $: subSearchField = $page.url.searchParams.get(`subSearchField`) || ``

  $: queryResult = createInfiniteQuery(
    [
      `GET_ALL_CATEGORIES`,
      {
        orderBy,
        search,
        searchField: search ? searchField : ``,
        subSearchField: search ? subSearchField : ``
      }
    ],

    GET_ALL_CATEGORIES,
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
  <h1 class="hidden text-xl font-medium leading-6 text-gray-900 sm:truncate lg:flex">
    {$page.data?.title || ``}
  </h1>
</TableMetrics>

<div class="h-full overflow-y-auto p-2 pt-0" class:pointer-events-none={$queryResult.isLoading}>
  <TableWrapper>
    <tr slot="header">
      <CategoryHeader />
    </tr>
    {#each allData as category (category.id)}
      <CategoryRow {category} />
    {:else}
      <tr>
        <td colspan="100%">
          {#if $queryResult.isLoading}
            <LoadingAlert>Loading categories ...</LoadingAlert>
          {:else if $queryResult.isError}
            <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
          {:else}
            <ErrorAlert>
              No <strong>categories</strong>
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
