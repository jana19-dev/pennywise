<script>
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  import { TextInput } from "@codepiercer/svelte-tailwind"

  import TableHeaderCell from "$lib/components/table/TableHeaderCell.svelte"
  import TableHeaderSort from "$lib/components/table/TableHeaderSort.svelte"

  import CreateCategory from "$lib/components/application/category/mutations/CreateCategory.svelte"

  $: activeSearch = $page.url.searchParams.get(`search`)
  $: activeSearchField = $page.url.searchParams.get(`searchField`)

  let searchFields = {
    name: ``
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
  <CreateCategory />
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
