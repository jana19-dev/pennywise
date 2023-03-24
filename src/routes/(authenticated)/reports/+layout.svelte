<script>
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"

  import { Button } from "@codepiercer/svelte-tailwind"
  import SelectReportInput from "$lib/components/select/SelectReportInput.svelte"

  const REPORTS = [`ACCOUNT_BALANCES`, `EXPENSE_BY_CATEGORY`, `EXPENSE_BY_PAYEE`, `INCOME_BY_PAYEE`]

  $: reportName = $page.url.pathname.split(`/`).pop()
</script>

<div class="flex h-full w-full flex-col lg:flex-row">
  <div class="flex p-2">
    <div class="flex w-full flex-col gap-2">
      <SelectReportInput
        name="reportName"
        label=""
        value={reportName !== `reports` ? reportName : ``}
        on:select={({ detail }) => {
          goto(`/reports/${detail.option.value}`)
        }}
        inputClass="bg-inherit"
        class="lg:hidden"
      />
      <div class="hidden flex-col gap-2 overflow-y-auto p-1 lg:flex">
        {#each REPORTS as report (report)}
          <div class="flex items-center gap-2">
            <Button
              variant={reportName === report ? `primary` : `outlined`}
              size="sm"
              class="w-full justify-between gap-2"
              href="/reports/{report}"
            >
              {report.replace(/_/g, ` `)}
            </Button>
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100">
    <slot />
  </div>
</div>
