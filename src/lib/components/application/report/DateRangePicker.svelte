<script>
  export let dateRange

  import html2canvas from "html2canvas"

  import { DateInput, DropdownMenu, Button } from "@codepiercer/svelte-tailwind"
  import ChevronDownIcon from "@codepiercer/svelte-tailwind/icons/ChevronDownIcon.svelte"

  import { formatDate } from "@codepiercer/svelte-tailwind/utils/date"

  const today = formatDate(new Date())

  const quickRanges = [
    {
      label: `This Month`,
      startDate: formatDate(new Date(new Date().setDate(1))),
      endDate: today
    },
    {
      label: `Last 3 Months`,
      startDate: formatDate(
        new Date(new Date(new Date().setDate(1)).setMonth(new Date().getMonth() - 2))
      ),
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
        new Date(
          new Date(new Date(new Date().setDate(1)).setMonth(0)).setFullYear(
            new Date().getFullYear() - 1
          )
        )
      ),
      endDate: formatDate(
        new Date(
          new Date(new Date(new Date().setDate(31)).setMonth(11)).setFullYear(
            new Date().getFullYear() - 1
          )
        )
      )
    }
  ]

  const saveAsPng = () => {
    const report = document.getElementById(`report`)
    report.style.overflowY = `unset`
    // document.body.style.overflow = `unset`

    const currencyViews = report.querySelectorAll(`.currency-view`)
    currencyViews.forEach((currencyView) => {
      currencyView.style.paddingBottom = `0.75rem`
    })
    html2canvas(report, {
      allowTaint: true,
      logging: false,
      windowWidth: window.outerWidth + window.innerWidth,
      windowHeight: window.outerHeight + window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      scale: 1,
      x: 0,
      y: 0
    })
      .then((canvas) => {
        const a = document.createElement(`a`)
        a.href = canvas.toDataURL(`image/png`)
        a.download = `report.png`
        a.click()
      })
      .finally(() => {
        report.style.overflowY = `auto`
        currencyViews.forEach((currencyView) => {
          currencyView.style.paddingBottom = `0.25rem`
        })
      })
  }
</script>

<div class="flex flex-col items-center gap-6 lg:flex-row">
  <Button on:click={saveAsPng}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
      <path
        fill-rule="evenodd"
        d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
        clip-rule="evenodd"
      />
    </svg>
    <span class="ml-2">Save as PNG</span>
  </Button>
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
        maxDate: formatDate(
          new Date(new Date().setDate(new Date(dateRange.endDate).getDate() - 30))
        )
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
    <DropdownMenu
      let:menuItemProps
      let:triggerProps
      color="gray"
      let:onOpen
      let:closeMenu
      placement="bottom-left"
      class="mt-12"
    >
      <Button
        slot="trigger"
        on:click={onOpen}
        {...triggerProps}
        color="blue"
        variant="outlined"
        class="p-1"
      >
        <span class="sr-only">Quick Ranges</span>
        <ChevronDownIcon />
      </Button>
      <div slot="content" class="min-w-[12rem]">
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
              >{label}
            </Button>
          {/each}
        </div>
      </div>
    </DropdownMenu>
  </div>
</div>
