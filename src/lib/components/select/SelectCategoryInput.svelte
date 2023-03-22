<script>
  export let name
  export let value
  export let label = `Select Category`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { SelectInput } from "@codepiercer/svelte-tailwind"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_CATEGORIES_LEAN } from "$lib/graphql/client/category/queries"

  const queryResult = createQuery([`GET_ALL_CATEGORIES_LEAN`], GET_ALL_CATEGORIES_LEAN)

  $: options =
    $queryResult?.data?.map((category) => ({
      label: category.name,
      value: category.id
    })) || []
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
  on:select
>
  <slot />
  <slot name="label" slot="label">
    {label}
  </slot>
</SelectInput>
