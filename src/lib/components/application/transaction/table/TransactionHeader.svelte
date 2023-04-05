<script>
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  import { TextInput, DateInput } from "@codepiercer/svelte-tailwind"

  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableHeaderSort from "$lib/components/table/TableHeaderSort.svelte"

  import SelectAccountInput from "$lib/components/select/SelectAccountInput.svelte"
  import SelectCategoryInput from "$lib/components/select/SelectCategoryInput.svelte"
  import SelectPayeeInput from "$lib/components/select/SelectPayeeInput.svelte"

  import CreateTransaction from "$lib/components/application/transaction/mutations/CreateTransaction.svelte"
  import CreateTransfer from "$lib/components/application/transaction/mutations/CreateTransfer.svelte"

  $: activeSearch = $page.url.searchParams.get(`search`)
  $: activeSearchField = $page.url.searchParams.get(`searchField`)

  let searchFields = {
    date: ``,
    account: ``,
    category: ``,
    payee: ``,
    amount: ``,
    memo: ``
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
  <div class="flex items-center gap-2">
    <CreateTransaction />
    <CreateTransfer />
  </div>
</TableHeaderCell>
<TableHeaderCell>
  <DateInput
    name="date"
    label="Date"
    type="date"
    class="min-w-[9rem] py-2"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`date`]}
    on:pickDate={({ detail }) => handleChange({ target: { name: `date`, value: detail.date } })}
  >
    <div slot="label">
      <TableHeaderSort orderByField="date">Date</TableHeaderSort>
    </div>
  </DateInput>
</TableHeaderCell>
<TableHeaderCell>
  <SelectAccountInput
    name="account"
    class="min-w-[9rem]"
    label="Account"
    hideIcon
    inputClass="text-xs py-1.5"
    color="gray"
    value={searchFields[`account`]}
    on:select={({ detail }) =>
      handleChange({
        target: { name: `account`, value: detail.option.value ? detail.option.label : `` }
      })}
  />
</TableHeaderCell>
<TableHeaderCell>
  <SelectCategoryInput
    name="category"
    class="min-w-[9rem]"
    label="Category"
    hideIcon
    inputClass="text-xs py-1.5"
    color="gray"
    value={searchFields[`category`]}
    on:select={({ detail }) =>
      handleChange({
        target: { name: `category`, value: detail.option.value ? detail.option.label : `` }
      })}
  />
</TableHeaderCell>
<TableHeaderCell>
  <SelectPayeeInput
    name="payee"
    class="min-w-[9rem]"
    label="Payee"
    hideIcon
    inputClass="text-xs py-1.5"
    color="gray"
    value={searchFields[`payee`]}
    on:select={({ detail }) =>
      handleChange({
        target: { name: `payee`, value: detail.option.value ? detail.option.label : `` }
      })}
  />
</TableHeaderCell>
<TableHeaderCell>
  <TextInput
    name="memo"
    label="Memo"
    class="min-w-[7rem] py-2.5"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`memo`]}
    on:stopTyping={handleChange}
  />
</TableHeaderCell>
<TableHeaderCell>
  <TextInput
    name="amount"
    type="number"
    inputProps={{ step: 0.01, min: 0 }}
    label="Amount"
    class="min-w-[7rem] py-2.5"
    inputClass="text-xs"
    color="gray"
    value={searchFields[`amount`]}
    on:stopTyping={handleChange}
  >
    <div slot="label">
      <TableHeaderSort orderByField="amount">Amount</TableHeaderSort>
    </div>
  </TextInput>
</TableHeaderCell>
