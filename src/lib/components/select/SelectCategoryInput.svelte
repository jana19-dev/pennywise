<script>
  export let name
  export let value
  export let label = `Select Category`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { Button, SelectInput } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"

  import CreateCategory from "$lib/components/application/category/mutations/CreateCategory.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_CATEGORIES_LEAN } from "$lib/graphql/client/category/queries"

  const queryResult = createQuery([`GET_ALL_CATEGORIES_LEAN`], GET_ALL_CATEGORIES_LEAN)

  let dialog

  $: categories =
    $queryResult?.data?.map((category) => ({
      label: category.name,
      value: category.id
    })) || []

  $: options = [
    {
      label: `TRANSFER TO`,
      value: `TRANSFER_TO`
    },
    {
      label: `TRANSFER FROM`,
      value: `TRANSFER_FROM`
    },
    ...categories
  ].sort((a, b) => a.label.localeCompare(b.label))
</script>

<SelectInput
  {name}
  {label}
  {value}
  {options}
  {isRequired}
  {direction}
  error={$queryResult.error?.message || error}
  isLoading={$queryResult.isLoading}
  {...$$props}
  let:searchValue
  on:select
>
  <slot />
  <slot name="label" slot="label">
    {label}
  </slot>
  <CreateCategory slot="addNew" bind:dialog initialValue={searchValue}>
    <Button variant="outlined" on:click={dialog.show} size="sm"
      ><PlusIcon class="-ml-2" />
      new: {searchValue}</Button
    >
  </CreateCategory>
</SelectInput>
