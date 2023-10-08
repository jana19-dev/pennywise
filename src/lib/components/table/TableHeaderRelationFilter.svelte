<script>
  export let value
  export let label
  export let searchField
  export let isActive
  export let handleChange
  export let filters

  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  import { TextInput, DropdownMenu, Button } from "$lib/components/ui"
  import ChevronDownIcon from "$lib/components/icons/ChevronDownIcon.svelte"
  import CheckOutlineIcon from "$lib/components/icons/CheckOutlineIcon.svelte"

  filters = {
    null: {
      component: TextInput,
      label: `-`,
      inputProps: {
        name: `null`
      }
    },
    ...filters
  }

  $: activeSubSearchField = $page.url.searchParams.get(`subSearchField`)

  onMount(() => {
    if (!filters[activeSubSearchField]) {
      if (isActive) {
        // clear the subSearchField if the activeSubSearchFilterField is not found; ie invalid search
        const searchParams = new URLSearchParams($page.url.searchParams.toString())
        searchParams.delete(`subSearchField`)
        goto(`?${searchParams.toString()}`, {
          keepFocus: true
        })
      } else {
        // not the active activeSubSearchField, so set the activeSubSearchFilterField to the first one
        activeSubSearchField = Object.keys(filters)[0]
      }
    }
  })

  const defaultFilterField = filters[Object.keys(filters)[0]]

  $: activeSubSearchFilterField = filters[activeSubSearchField] || defaultFilterField

  const onSubSearchFieldChange = (field) => {
    const searchParams = new URLSearchParams($page.url.searchParams.toString())
    if (field === `null`) {
      searchParams.delete(`subSearchField`)
      searchParams.delete(`searchField`)
      searchParams.delete(`search`)
    } else {
      searchParams.set(`searchField`, searchField)
      searchParams.set(`subSearchField`, field)
    }
    goto(`?${searchParams.toString()}`, {
      keepFocus: true
    })
  }

  const handleOnClear = ({ detail }) => {
    const { name } = detail
    handleSubSearchFieldValueChange({
      target: {
        name,
        value: ``
      }
    })
  }

  const handleOptionSelect = ({ detail }) => {
    const { name, option } = detail
    // check if option.value is a uuid; if so, use option.label instead
    if (option.value.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
      handleSubSearchFieldValueChange({
        target: {
          name,
          value: option.label
        }
      })
    } else {
      handleSubSearchFieldValueChange({
        target: {
          name,
          value: option.value
        }
      })
    }
  }

  const handleDateChange = ({ detail }) => {
    const { name, date } = detail
    handleSubSearchFieldValueChange({
      target: {
        name,
        value: date
      }
    })
  }

  const handleSubSearchFieldValueChange = (e) => {
    const { name } = e.target
    const searchParams = new URLSearchParams($page.url.searchParams.toString())
    if (name === `null`) {
      searchParams.set(`subSearchField`, Object.keys(filters)[1])
    } else {
      searchParams.set(`subSearchField`, name)
    }
    const newEvent = {
      target: {
        name: searchField,
        value: e.target.value
      }
    }
    handleChange(newEvent, searchParams.toString())
  }
</script>

<svelte:component
  this={activeSubSearchFilterField.component}
  class="min-w-[9rem] py-[0.45rem]"
  {...activeSubSearchFilterField.inputProps}
  {label}
  {value}
  on:stopTyping={handleSubSearchFieldValueChange}
  on:select={handleOptionSelect}
  on:clear={handleOnClear}
  on:pickDate={handleDateChange}
  color="gray"
>
  <DropdownMenu color="gray" placement="bottom-left">
    <Button slot="trigger" let:onOpen on:click={onOpen} let:triggerProps {...triggerProps} color="gray" variant="ghost" class="p-0">
      <span class="sr-only">Filter by</span>
      <ChevronDownIcon />
    </Button>
    <div slot="content" let:closeMenu let:menuItemProps class="min-w-[12rem]">
      <div class="flex flex-col gap-2 bg-white p-1" role="none">
        {#each Object.keys(filters) as filter (filter + searchField)}
          {@const isSelected = activeSubSearchField === filter}
          <Button
            {...menuItemProps}
            on:click={() => {
              closeMenu()
              onSubSearchFieldChange(filter)
            }}
            variant="ghost"
            color="gray"
            class="items-center justify-between py-0.5"
          >
            {filters[filter].label}
            {#if isSelected}
              <CheckOutlineIcon class="text-yellow-700" />
            {/if}
          </Button>
        {/each}
      </div>
    </div>
  </DropdownMenu>
</svelte:component>
