<script>
  export let name
  export let value
  export let label = `Select Report`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { SelectInput } from "@codepiercer/svelte-tailwind"

  const options = [
    { label: `ACCOUNT TRANSACTIONS`, value: `ACCOUNT_TRANSACTIONS` },
    { label: `CATEGORY TRANSACTIONS`, value: `CATEGORY_TRANSACTIONS` },
    { label: `PAYEE TRANSACTIONS`, value: `PAYEE_TRANSACTIONS` },
    { label: `EXPENSE BY CATEGORY`, value: `EXPENSE_BY_CATEGORY` },
    { label: `EXPENSE BY PAYEE`, value: `EXPENSE_BY_PAYEE` },
    { label: `INCOME BY PAYEE`, value: `INCOME_BY_PAYEE` },
    { label: `ACCOUNT BALANCES`, value: `ACCOUNT_BALANCES` }
  ]
</script>

<SelectInput
  {name}
  {label}
  {value}
  {error}
  {options}
  {isRequired}
  {direction}
  {...$$props}
  on:select
>
  <slot />
  <slot name="label" slot="label">
    {label}
  </slot>
</SelectInput>
