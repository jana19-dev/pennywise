<script>
  export let name
  export let value
  export let label = `Select Payee`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { Button, SelectInput } from "$lib/components/ui"
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte"

  import { createQuery } from "@tanstack/svelte-query"
  import { GET_ALL_PAYEES_LEAN } from "$lib/graphql/client/payee/queries"

  import CreatePayee from "$lib/components/application/payee/mutations/CreatePayee.svelte"

  const queryResult = createQuery([`GET_ALL_PAYEES_LEAN`], GET_ALL_PAYEES_LEAN)

  let dialog

  $: options =
    $queryResult?.data?.map((payee) => ({
      label: payee.name,
      value: payee.id
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
  <CreatePayee slot="addNew" let:searchValue bind:dialog initialValue={searchValue}>
    <Button variant="outlined" on:click={dialog.show} size="sm">
      <PlusIcon class="-ml-2" />
      new: {searchValue}
    </Button>
  </CreatePayee>
</SelectInput>
