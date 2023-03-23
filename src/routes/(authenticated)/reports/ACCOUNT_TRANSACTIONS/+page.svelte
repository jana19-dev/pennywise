<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import DateRangePicker from "$lib/components/ui/DateRangePicker.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ACCOUNT_TRANSACTIONS_REPORT } from "$lib/graphql/client/report/queries"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  const today = formatDate(new Date())
  let dateRange = {
    startDate: formatDate(new Date(new Date().setDate(1))), // set to start of month
    endDate: today
  }
  $: queryResult = createQuery(
    [
      `GET_ACCOUNT_TRANSACTIONS_REPORT`,
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    ],
    GET_ACCOUNT_TRANSACTIONS_REPORT
  )
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="inline-flex gap-2 text-2xl font-semibold tracking-tight text-gray-900">
        Account Transactions Summary
      </h1>
      <DateRangePicker bind:dateRange />
    </div>
  </div>
  <ReportBody {queryResult} />
</div>
