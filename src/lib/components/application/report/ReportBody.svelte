<script>
  export let queryResult
  export let chartOptions = {}

  import { LoadingAlert, ErrorAlert } from "@codepiercer/svelte-tailwind"

  import TableWrapper from "$lib/components/table/TableWrapper.svelte"
  import CurrencyView from "$lib/components/ui/CurrencyView.svelte"

  import Chart from "svelte-frappe-charts"

  let chartRef

  $: if (chartRef) {
    // set position to sticky
    const element = document.getElementsByClassName(`chart-container`)[0]
    const parent = element.parentElement
    parent.style.position = `sticky`
    parent.style.top = `0`
  }
</script>

{#if $queryResult.isFetching}
  <LoadingAlert>Loading data ...</LoadingAlert>
{:else if $queryResult.isError}
  <ErrorAlert>Error: {$queryResult.error.message}</ErrorAlert>
{:else if $queryResult.data}
  <div class="flex w-full flex-col justify-between px-4">
    <div class="overflow-x-auto pt-6">
      <TableWrapper>
        <tr slot="header" class="h-6 bg-blue-200 text-xs font-semibold">
          {#each $queryResult.data.table.labels as label, idx}
            <td class="min-w-[5rem] px-3" class:text-right={idx !== 0}>{label}</td>
          {/each}
        </tr>
        {#each $queryResult.data.table.rows as row, idx}
          {@const isTotalRow = idx >= $queryResult.data.table.rows.length - 1}
          <tr class="h-10 text-xs" class:bg-gray-100={isTotalRow}>
            {#each row as cell, idx}
              {@const isTotalCell = idx >= row.length - 2}
              <td class="px-2" class:text-right={idx !== 0} class:bg-gray-100={isTotalCell}>
                {#if parseFloat(cell) === parseFloat(cell)}
                  <CurrencyView amount={cell} />
                {:else}
                  {cell}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </TableWrapper>
    </div>
    {#if $queryResult.data.chart.datasets[0].values.filter(Boolean).length > 1}
      <div class="">
        <Chart bind:this={chartRef} data={$queryResult.data.chart} {...chartOptions} />
      </div>
    {/if}
  </div>
{:else}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <slot>
      <p class="text-gray-500">No data to display</p>
    </slot>
  </div>
{/if}
