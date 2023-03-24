<script>
  import ReportBody from "$lib/components/application/report/ReportBody.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_EXPENSE_BY_CATEGORY_REPORT } from "$lib/graphql/client/report/queries"

  const queryResult = createQuery(
    [`GET_EXPENSE_BY_CATEGORY_REPORT`],
    GET_EXPENSE_BY_CATEGORY_REPORT
  )
</script>

<div class="flex min-h-full flex-col overflow-auto bg-white">
  <div class="rounded-md p-4 shadow-md">
    <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
      <h1 class="inline-flex gap-2 text-2xl font-semibold tracking-tight text-gray-900">
        Expense by Category
      </h1>
    </div>
  </div>
  <ReportBody
    {queryResult}
    chartOptions={{
      barOptions: {
        stacked: true,
        spaceRatio: 0.5
      }
    }}
  />
</div>
