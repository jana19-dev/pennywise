<script>
  export let queryResult

  import { LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableCell from "$lib/components/table/TableCell.svelte"

  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import Chart from "svelte-frappe-charts"
</script>

{#if $queryResult.isFetching}
  <LoadingAlert>Loading data ...</LoadingAlert>
{:else if $queryResult.isError}
  <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
{:else if $queryResult.data}
  {#if $queryResult.data.chart}
    <div class="overflow-x-clip">
      <Chart
        data={$queryResult.data.chart}
        type="bar"
        axisOptions={{
          xIsSeries: true,
          xAxisMode: `tick`
        }}
        tooltipOptions={{
          formatTooltipY: (d) =>
            parseFloat(d)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, `,`)
        }}
        colors={[`#667EEA`]}
      />
    </div>
  {/if}
  <div class="overflow-y-auto px-4 pb-4">
    <TableWrapper>
      <tr slot="header" class="bg-blue-800 text-xs font-semibold">
        {#each $queryResult.data.table.labels as label, idx}
          <TableHeaderCell bg="blue">
            <div class:text-right={idx !== 0}>
              {label}
            </div>
          </TableHeaderCell>
        {/each}
      </tr>
      {#each $queryResult.data.table.rows as row, idx}
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
              <div class:text-right={idx !== 0} class:text-white={isTotalRow}>
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
