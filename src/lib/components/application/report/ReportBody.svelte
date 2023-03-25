<script>
  export let queryResult
  export let chartOptions = {}
  export let noAverage = false

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
        <tr slot="header" class="h-6 bg-blue-300 text-xs font-semibold">
          {#each $queryResult.data.table.labels as label, idx}
            <td class="min-w-[6rem] px-3" class:text-right={idx !== 0}>{label}</td>
          {/each}
        </tr>
        {#each $queryResult.data.table.rows as row, idx}
          {@const isTotalRow = noAverage
            ? idx === $queryResult.data.table.rows.length - 1
            : idx >= $queryResult.data.table.rows.length - 1}
          <tr class="h-10 text-xs" class:bg-blue-50={isTotalRow}>
            {#each row as cell, idx}
              {@const isTotalCell = noAverage ? idx >= row.length - 1 : idx >= row.length - 2}
              <td
                class="border-x border-b border-gray-200 px-2"
                class:text-right={idx !== 0}
                class:bg-blue-50={isTotalCell}
              >
                {#if idx > 0}
                  <CurrencyView amount={cell} />
                {:else}
                  <strong>{cell}</strong>
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </TableWrapper>
    </div>
    <Chart bind:this={chartRef} data={$queryResult.data.chart} {...chartOptions} />
  </div>
{:else}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <slot>
      <p class="text-gray-500">No data to display</p>
    </slot>
  </div>
{/if}
