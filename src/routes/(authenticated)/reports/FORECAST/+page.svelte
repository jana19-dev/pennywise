<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_FORECAST_REPORT } from "$lib/graphql/client/report/queries"

  const queryResult = createQuery([`GET_FORECAST_REPORT`], GET_FORECAST_REPORT)
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="mb-4 rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="hidden gap-2 text-2xl font-semibold tracking-tight text-gray-900 lg:inline-flex">Forecast Report</h1>
    </div>
  </div>
  <ReportBody {queryResult} isForecast />
</div>
