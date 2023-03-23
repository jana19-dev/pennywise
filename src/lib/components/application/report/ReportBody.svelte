<script>
  export let queryResult

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
  <div class="flex w-full flex-col justify-between px-4 lg:flex-row">
    <div class="pt-6 lg:min-w-[24rem]">
      <TableWrapper>
        <tr slot="header" class="h-6 bg-blue-200 text-xs font-semibold">
          {#each $queryResult.data.table.labels as label}
            <td class="px-3 text-right">{label}</td>
          {/each}
        </tr>
        {#each $queryResult.data.table.rows as row, idx}
          {@const isLastRow = idx === $queryResult.data.table.rows.length - 1}
          <tr
            class="h-10 text-xs"
            class:bg-gray-50={idx % 2 === 0}
            class:bg-gray-500={isLastRow}
            class:text-white={isLastRow}
          >
            {#each row as cell}
              <td class="px-2 text-right">
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
    <div class="hidden flex-1 lg:block">
      <Chart
        bind:this={chartRef}
        data={$queryResult.data.chart}
        colors={[`#00b894`, `#ff5252`, `#7cd6fd`]}
      />
    </div>
  </div>
{:else}
  <div class="flex h-full w-full flex-col items-center justify-center">
    <slot>
      <p class="text-gray-500">No data to display</p>
    </slot>
  </div>
{/if}
