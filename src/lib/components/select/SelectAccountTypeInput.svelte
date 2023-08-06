<script>
  export let name
  export let value
  export let label = `Select Account Type`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { Button, SelectInput } from "$lib/components/ui"
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte"

  import CreateAccountType from "$lib/components/application/accountType/mutations/CreateAccountType.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_ACCOUNT_TYPES_LEAN } from "$lib/graphql/client/accountType/queries"

  const queryResult = createQuery([`GET_ALL_ACCOUNT_TYPES_LEAN`], GET_ALL_ACCOUNT_TYPES_LEAN)

  let dialog

  $: options =
    $queryResult?.data?.map((accountType) => ({
      label: accountType.name,
      value: accountType.id
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
  <CreateAccountType slot="addNew" let:searchValue bind:dialog initialValue={searchValue}>
    <Button variant="outlined" on:click={dialog.show} size="sm">
      <PlusIcon class="-ml-2" />
      new: {searchValue}
    </Button>
  </CreateAccountType>
</SelectInput>
