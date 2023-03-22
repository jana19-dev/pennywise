<script>
  export let name
  export let value
  export let label = `Select Account`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { SelectInput } from "@codepiercer/svelte-tailwind"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_ACCOUNTS_LEAN } from "$lib/graphql/client/account/queries"

  const queryResult = createQuery([`GET_ALL_ACCOUNTS_LEAN`], GET_ALL_ACCOUNTS_LEAN)

  $: options =
    $queryResult?.data?.map((account) => ({
      label: account.name,
      value: account.id
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
