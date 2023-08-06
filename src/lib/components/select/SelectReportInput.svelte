<script>
  export let name
  export let value
  export let label = `Select Report`
  export let isRequired = false
  export let error = null
  export let direction = `bottom`

  import { SelectInput } from "$lib/components/ui"

  const options = [
    { label: `ACCOUNTS`, value: `ACCOUNTS` },
    { label: `CATEGORIES`, value: `CATEGORIES` },
    { label: `PAYEES`, value: `PAYEES` },
    { label: `FORECAST`, value: `FORECAST` }
  ]
</script>

<SelectInput {name} {label} {value} {error} {options} {isRequired} {direction} {...$$props} on:select>
  <slot />
  <slot name="label" slot="label">
    {label}
  </slot>
</SelectInput>
