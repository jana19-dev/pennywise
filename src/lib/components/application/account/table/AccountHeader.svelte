<script>
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  import { TextInput, DateInput } from "@codepiercer/svelte-tailwind"

  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableHeaderSort from "$lib/components/table/TableHeaderSort.svelte"

  import SelectAccountTypeInput from "$lib/components/select/SelectAccountTypeInput.svelte"

  import CreateAccount from "$lib/components/application/account/mutations/CreateAccount.svelte"

  $: activeSearch = $page.url.searchParams.get(`search`)
  $: activeSearchField = $page.url.searchParams.get(`searchField`)

  let searchFields = {
    name: ``,
    accountType: ``,
    startingDate: ``,
    startingBalance: ``
  }

  $: {
    // set the active search field to the active search and clear the rest
    searchFields = Object.keys(searchFields).reduce((acc, key) => {
      if (key === activeSearchField) {
        acc[key] = activeSearch
      } else {
        acc[key] = ``
      }
      return acc
    }, {})
  }

  const handleChange = (e, searchParamsString) => {
    e.target.value = e.target.value.trim()
    const { name, value } = e.target
    const searchParams = new URLSearchParams(
      searchParamsString || $page.url.searchParams.toString()
    )
    searchParams.set(`searchField`, name)
    searchParams.set(`search`, value)
    if (value === ``) {
      searchParams.delete(`searchField`)
      searchParams.delete(`search`)
      searchParams.delete(`subSearchField`)
    }
    goto(`?${searchParams.toString()}`, {
      keepFocus: true
    })
  }
</script>

<TableHeaderCell>
  <CreateAccount />
</TableHeaderCell>
<TableHeaderCell>
  <TextInput
    name="name"
    label="Name"
    class="min-w-[7rem] py-2.5"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`name`]}
    on:stopTyping={handleChange}
  >
    <div slot="label">
      <TableHeaderSort orderByField="name">Name</TableHeaderSort>
    </div>
  </TextInput>
</TableHeaderCell>
<TableHeaderCell>
  <SelectAccountTypeInput
    name="accountType"
    class="min-w-[9rem]"
    label="Account Type"
    hideIcon
    inputClass="text-xs py-1.5"
    color="gray"
    value={searchFields[`accountType`]}
    on:select={({ detail }) =>
      handleChange({
        target: { name: `accountType`, value: detail.option.value ? detail.option.label : `` }
      })}
  />
</TableHeaderCell>
<TableHeaderCell>
  <DateInput
    name="startingDate"
    label="Starting Date"
    type="date"
    class="min-w-[7rem] py-2"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`startingDate`]}
    on:pickDate={({ detail }) =>
      handleChange({ target: { name: `startingDate`, value: detail.date } })}
  >
    <div slot="label">
      <TableHeaderSort orderByField="startingDate">Starting Date</TableHeaderSort>
    </div>
  </DateInput>
</TableHeaderCell>
<TableHeaderCell>
  <TextInput
    name="startingBalance"
    type="number"
    label="Starting Balance"
    class="min-w-[7rem] py-2.5"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`startingBalance`]}
    on:stopTyping={handleChange}
  >
    <div slot="label">
      <TableHeaderSort orderByField="startingBalance">Starting Balance</TableHeaderSort>
    </div>
  </TextInput>
</TableHeaderCell>
<TableHeaderCell>
  <div class="text-right">Current Balance</div>
</TableHeaderCell>
