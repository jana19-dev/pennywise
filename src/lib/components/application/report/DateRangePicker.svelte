<script>
  export let dateRange

  import { DateInput, DropdownMenu, Button } from "$lib/components/ui"
  import ChevronDownIcon from "$lib/components/icons/ChevronDownIcon.svelte"

  import { formatDate } from "$lib/utils/client/date"

  const today = formatDate(new Date())

  const quickRanges = [
    {
      label: `This Month`,
      startDate: formatDate(new Date(new Date().setDate(1))),
      endDate: today
    },
    {
      label: `Last 3 Months`,
      startDate: formatDate(new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 2))),
      endDate: formatDate(new Date(new Date()))
    },
    {
      label: `This Year`,
      startDate: formatDate(new Date(new Date(new Date().setDate(1)).setMonth(0))),
      endDate: today
    },
    {
      label: `Last Year`,
      startDate: formatDate(
        new Date(new Date(new Date(new Date().setDate(1)).setMonth(0)).setFullYear(new Date().getFullYear() - 1))
      ),
      endDate: formatDate(
        new Date(new Date(new Date(new Date().setDate(31)).setMonth(11)).setFullYear(new Date().getFullYear() - 1))
      )
    }
  ]
</script>

<div class="flex flex-col items-center gap-6 lg:flex-row">
  <div class="flex items-center gap-2">
    <DateInput
      noClear
      name="startDate"
      label="Start Date"
      type="date"
      value={dateRange.startDate}
      on:pickDate={({ detail }) => {
        dateRange.startDate = detail.date || today
      }}
      options={{
        maxDate: formatDate(new Date(new Date().setDate(new Date(dateRange.endDate).getDate() - 30)))
      }}
      class="min-w-[10rem]"
    />
    <DateInput
      noClear
      name="endDate"
      label="End Date"
      type="date"
      value={dateRange.endDate}
      on:pickDate={({ detail }) => {
        dateRange.endDate = detail.date || today
      }}
      options={{ minDate: dateRange.startDate, maxDate: today }}
      class="min-w-[10rem]"
    />
    <DropdownMenu color="gray" placement="bottom-left" class="mt-12">
      <Button
        slot="trigger"
        let:triggerProps
        let:onOpen
        on:click={onOpen}
        {...triggerProps}
        color="blue"
        variant="outlined"
        class="p-1"
      >
        <span class="sr-only">Quick Ranges</span>
        <ChevronDownIcon />
      </Button>
      <div slot="content" let:closeMenu let:menuItemProps class="min-w-[12rem]">
        <div class="flex flex-col gap-2 bg-white p-1" role="none">
          {#each quickRanges as { label, ...range }}
            <Button
              {...menuItemProps}
              on:click={() => {
                closeMenu()
                dateRange = range
              }}
              variant="ghost"
              color="gray"
              class="items-center justify-between py-0.5"
            >
              {label}
            </Button>
          {/each}
        </div>
      </div>
    </DropdownMenu>
  </div>
</div>
