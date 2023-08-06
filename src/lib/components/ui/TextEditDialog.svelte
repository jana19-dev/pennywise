<script>
  export let dialog
  export let isInline = false // if true, will not show border and label
  export let type = `text` // text, email, password, number, tel, url
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let label = name // use name if label is not provided
  export let placeholder = ``
  export let isDisabled = false
  export let isRequired = false
  export let isLoading = false
  export let isTouched = false
  export let error = ``
  export let serverError = ``
  export let value = ``
  export let inputClass = ``
  export let displayClass = ``
  export let mask = null
  export let inputProps = {}

  import { createEventDispatcher } from "svelte"
  import { twMerge } from "tailwind-merge"

  import TextInput from "./TextInput.svelte"
  import FormDialog from "./FormDialog.svelte"
  import Button from "./Button.svelte"

  import PencilSquareIcon from "$lib/components/icons/PencilSquareIcon.svelte"
  import colors from "$lib/utils/client/colors"

  const colorObject = colors[color]
  const style = Object.entries({
    "--text-color": colorObject[`900`],
    "--normal-ring": `0 0 0 1px ${colorObject[`300`]}`
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  let classes = `relative flex h-fit items-center justify-between gap-2 rounded-md`
  if (!isInline) {
    classes = twMerge(classes, `wrapper shadow-sm px-3 py-3`)
  }
  classes = twMerge(classes, $$props.class)

  let isVisible = !isInline

  const dispatch = createEventDispatcher()

  const onClose = () => {
    dialog.hide()
    dispatch(`close`)
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

  <div class={twMerge(`pr-8`, displayClass)}>
    <slot>
      <span class={twMerge(`px-1 text-sm`, displayClass)}>
        {value || `-`}
      </span>
    </slot>
  </div>

  {#if isVisible}
    <Button
      class={isInline ? `absolute right-0` : ``}
      size="small"
      variant="outlined"
      on:click={dialog.show}
      {color}
      {isDisabled}
    >
      <PencilSquareIcon />
      <span class="sr-only">Edit</span>
    </Button>
  {/if}
</div>

<FormDialog bind:dialog title={`Update ${label}`} error={serverError} {isLoading} on:submit on:close={onClose}>
  <TextInput
    on:stopTyping
    on:change
    on:keyup
    {color}
    {type}
    {label}
    {name}
    {isLoading}
    {error}
    {value}
    {isTouched}
    {isRequired}
    {placeholder}
    {inputClass}
    {mask}
    {inputProps}
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
