<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import DateRangePicker from "$lib/components/ui/DateRangePicker.svelte"
  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_EXPENSE_BY_PAYEE_REPORT } from "$lib/graphql/client/report/queries"

  const today = formatDate(new Date())
  let dateRange = {
    startDate: formatDate(new Date(new Date(new Date().setDate(1)).setMonth(0))), // set to start of year
    endDate: today
  }
  $: queryResult = createQuery(
    [
      `GET_EXPENSE_BY_PAYEE_REPORT`,
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    ],
    GET_EXPENSE_BY_PAYEE_REPORT
  )
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="inline-flex gap-2 text-2xl font-semibold tracking-tight text-gray-900">
        Expense by Payee
      </h1>
      <DateRangePicker bind:dateRange />
    </div>
  </div>
  <ReportBody
    {queryResult}
    chartOptions={{
      type: `axis-mixed`,
      barOptions: {
        stacked: true,
        spaceRatio: 0.5
      },
      axisOptions: {
        xIsSeries: true,
        xAxisMode: `tick`
      },
      tooltipOptions: {
        formatTooltipY: (d) => parseFloat(d).toFixed(2)
      }
    }}
  />
</div>
