<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import DateRangePicker from "$lib/components/ui/DateRangePicker.svelte"
  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ACCOUNT_BALANCES_REPORT } from "$lib/graphql/client/report/queries"

  const today = formatDate(new Date())
  let dateRange = {
    startDate: formatDate(new Date(new Date(new Date().setDate(1)).setMonth(0))), // set to start of year
    endDate: today
  }
  $: queryResult = createQuery(
    [
      `GET_ACCOUNT_BALANCES_REPORT`,
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    ],
    GET_ACCOUNT_BALANCES_REPORT
  )
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="hidden gap-2 text-2xl font-semibold tracking-tight text-gray-900 lg:inline-flex">
        Account Balances
      </h1>
      <DateRangePicker bind:dateRange />
    </div>
  </div>
  <ReportBody
    noAverage
    {queryResult}
    chartOptions={{
      type: `axis-mixed`,
      axisOptions: {
        xIsSeries: true,
        xAxisMode: `tick`
      },
      tooltipOptions: {
        formatTooltipY: (d) => parseFloat(d).toFixed(2)
      },
      lineOptions: {
        regionFill: 1
      }
    }}
  />
</div>
