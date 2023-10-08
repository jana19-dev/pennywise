<script>
  export let dialog
  export let isInline = false // if true, will not show border and label
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let label = name // use name if label is not provided
  export let options = [
    { label: `Apple`, value: `apple` },
    { label: `Banana`, value: `banana` },
    { label: `Orange`, value: `orange` }
  ]
  export let isDisabled = false
  export let isRequired = false
  export let isLoading = false
  export let error = ``
  export let serverError = ``
  export let value = ``
  export let dialogClass = ``
  export let inputClass = ``
  export let displayClass = ``
  export let hideIcon = false

  import { createEventDispatcher } from "svelte"
  import { twMerge } from "tailwind-merge"

  import SelectInput from "./SelectInput.svelte"
  import FormDialog from "./FormDialog.svelte"
  import Button from "./Button.svelte"
  import PencilSquareIcon from "$lib/components/icons/PencilSquareIcon.svelte"
  import colors from "$lib/utils/client/colors"

  const colorObject = colors[color]
  const style = Object.entries({
    "--text-color": colorObject[`900`],
    "--normal-ring": `0 0 0 1px ${colorObject[`300`]}`,
    "--min-width": `${label.length}ch`
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
        {options.find((option) => option.value === value)?.label || `select option`}
      </span>
    </slot>
  </div>

  {#if isVisible}
    <Button class={isInline ? `absolute right-0` : ``} size="small" variant="outlined" on:click={dialog.show} {color} {isDisabled}>
      <PencilSquareIcon />
      <span class="sr-only">Edit</span>
    </Button>
  {/if}
</div>

<FormDialog
  bind:dialog
  title={`Update ${label}`}
  error={serverError}
  {isLoading}
  on:submit
  on:close={onClose}
  class={twMerge(`min-h-[14rem]`, dialogClass)}
>
  <slot name="input">
    <SelectInput on:select {isLoading} {error} {value} {name} {color} {isRequired} {label} {options} {inputClass} {hideIcon} {isDisabled} />
  </slot>
  <slot name="info" />
</FormDialog>

<style>
  .wrapper {
    box-shadow: var(--normal-ring);
    min-width: calc(var(--min-width) + 2rem);
  }

  .label {
    color: var(--text-color);
    min-width: var(--min-width);
  }

  .label.isRequired:after {
    color: #e32;
    content: " *";
    display: isInline;
  }
</style>
