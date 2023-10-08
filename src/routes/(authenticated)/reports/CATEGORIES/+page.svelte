<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import DateRangePicker from "$lib/components/application/report/DateRangePicker.svelte"
  import { formatDate } from "$lib/utils/client/date"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_CATEGORIES_REPORT } from "$lib/graphql/client/report/queries"

  const today = formatDate(new Date())
  let dateRange = {
    startDate: formatDate(new Date(new Date(new Date().setDate(1)).setMonth(0))), // set to start of year
    endDate: today
  }
  $: queryResult = createQuery(
    [
      `GET_CATEGORIES_REPORT`,
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    ],
    GET_CATEGORIES_REPORT
  )
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="mb-4 rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="hidden gap-2 text-2xl font-semibold tracking-tight text-gray-900 lg:inline-flex">Summary by Category</h1>
      <DateRangePicker bind:dateRange />
    </div>
  </div>
  <ReportBody {queryResult} />
</div>
