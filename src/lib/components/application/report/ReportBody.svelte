<script>
  export let queryResult

  import { LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableCell from "$lib/components/table/TableCell.svelte"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"
</script>

{#if $queryResult.isFetching}
  <LoadingAlert>Loading data ...</LoadingAlert>
{:else if $queryResult.isError}
  <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
{:else if $queryResult.data}
  <div class="overflow-y-auto px-4 pb-4" id="report">
    <TableWrapper>
      <tr slot="header" class="bg-blue-800 text-xs font-semibold">
        {#each $queryResult.data.labels as label, idx}
          <TableHeaderCell bg="blue">
            <div class:text-right={idx !== 0}>
              {label}
            </div>
          </TableHeaderCell>
        {/each}
      </tr>
      {#each $queryResult.data.rows as row, idx}
        {@const isTotalRow = idx === 0}
        <tr
          class="h-10 text-xs hover:bg-blue-100"
          class:bg-blue-800={isTotalRow}
          class:hover:bg-blue-800={isTotalRow}
          class:sticky={isTotalRow}
          class:z-20={isTotalRow}
          class:top-[3rem]={isTotalRow}
          class:text-right={isTotalRow}
        >
          {#each row as cell, idx}
            <TableCell>
              <div
                class:text-right={idx !== 0}
                class:text-white={isTotalRow}
                class:-mt-4={isTotalRow}
              >
                {#if idx > 0}
                  <CurrencyView amount={cell} />
                {:else}
                  <strong>{cell}</strong>
                {/if}
              </div>
            </TableCell>
          {/each}
        </tr>
      {/each}
    </TableWrapper>
  </div>
{:else}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <slot>
      <p class="text-gray-500">No data to display</p>
    </slot>
  </div>
{/if}
