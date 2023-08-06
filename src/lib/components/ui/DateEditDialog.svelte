<script>
  export let dialog
  export let isInline = false // if true, will not show border and label
  export let type = `datetime` // date, datetime, time
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let label = name // use name if label is not provided
  export let placeholder = ``
  export let isDisabled = false
  export let isRequired = false
  export let error = ``
  export let serverError = ``
  export let value = ``
  export let isLoading = false
  export let inputClass = ``
  export let displayClass = ``
  export let options = {}

  import { createEventDispatcher } from "svelte"
  import { twMerge } from "tailwind-merge"

  import FormDialog from "./FormDialog.svelte"
  import Button from "./Button.svelte"
  import DateInputInline from "./DateInputInline.svelte"
  import PencilSquareIcon from "$lib/components/icons/PencilSquareIcon.svelte"
  import colors from "$lib/utils/client/colors"
  import { formatDate, formatTime, formatDateTime } from "$lib/utils/client/date"

  const colorObject = colors[color]
  const style = Object.entries({
    "--text-color": colorObject[`900`],
    "--normal-ring": `0 0 0 1px ${colorObject[`300`]}`
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  let classes = `relative flex h-fit items-center justify-between gap-2 rounded-md w-full`
  if (!isInline) {
    classes = twMerge(classes, `wrapper border shadow-sm px-3 py-3`)
  }
  classes = twMerge(classes, $$props.class)

  let isVisible = !isInline

  const dispatch = createEventDispatcher()

  const onClose = () => {
    dispatch(`close`)
    dialog.hide()
  }
</script>

<div
  {style}
  class={classes}
  on:mouseenter={() => (isInline ? (isVisible = true) : null)}
  on:mouseleave={() => (isInline ? (isVisible = false) : null)}
  role="group"
>
  {#if !isInline}
    <span class="label absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
      {label}
    </span>
  {/if}
  <slot>
    <span class={twMerge(`px-1 text-sm`, displayClass)}>
      {#if value}
        {#if type === `date`}
          {formatDate(value)}
        {:else if type === `datetime`}
          {formatDateTime(value)}
        {:else}
          {formatTime(value)}
        {/if}
      {:else}
        -
      {/if}
    </span>
  </slot>

  {#if isVisible}
    <Button size="small" variant="outlined" on:click={dialog.show} {color} {isDisabled}>
      <PencilSquareIcon />
      <span class="sr-only">Edit</span>
    </Button>
  {/if}
</div>

<FormDialog bind:dialog title={`Update ${label}`} error={serverError} {isLoading} on:close={onClose} on:submit>
  <DateInputInline
    on:pickDate
    {color}
    {type}
    {label}
    {name}
    {error}
    {value}
    {isRequired}
    {placeholder}
    {inputClass}
    {options}
  />
  <slot name="info" />
</FormDialog>

<style>
  .wrapper {
    box-shadow: var(--normal-ring);
  }

  .label {
    color: var(--text-color);
  }

  .label.isRequired:after {
    color: #e32;
    content: " *";
    display: isInline;
  }
</style>
