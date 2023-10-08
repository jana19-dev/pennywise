<script>
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let type = `datetime` // date, datetime, time
  export let label = name // use name if label is not provided
  export let placeholder = ``
  export let isRequired = false
  export let isDisabled = false
  export let error = ``
  export let value = ``
  export let options = {}
  export let id = `${name}-${Math.random()}`
  export let noClear = false

  import { createEventDispatcher } from "svelte"

  import flatpickr from "flatpickr"
  import { twMerge } from "tailwind-merge"

  import Button from "./Button.svelte"
  import Dialog from "./Dialog.svelte"
  import ExclamationCircleIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
  import XMarkIcon from "$lib/components/icons/XMarkIcon.svelte"
  import colors from "$lib/utils/client/colors"
  import { formatDate, formatTime, formatDateTime } from "$lib/utils/client/date"

  let inputRef
  let dialog

  const colorObject = colors[color]
  const style = Object.entries({
    "--border-color": colorObject[`300`],
    "--error-border-color": colors[`red`][`500`],
    "--normal-ring-focus": `0 0 0 2px ${colorObject[`600`]}`,
    "--error-ring-focus": `0 0 0 2px ${colors[`red`][`600`]}`,
    "--text-color": colorObject[`900`],
    "--error-text-color": colors[`red`][`600`]
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  const classes = twMerge(`relative rounded-md border px-1 py-[0.7rem] shadow-sm h-fit w-auto wrapper min-w-[7rem]`, $$props.class)

  const onOpen = () => {
    dialog.show()
    setTimeout(() => {
      flatpickr(inputRef, {
        defaultDate: value,
        ...options,
        static: false,
        inline: true,
        enableTime: type === `datetime` || type === `time`,
        noCalendar: type === `time`,
        dateFormat: type === `date` ? `Y-m-d` : `Y-m-dTH:i`
      })
    })
  }

  const dispatch = createEventDispatcher()

  const onClear = () => {
    inputRef._flatpickr.setDate(``)
    dispatch(`pickDate`, { name, date: `` })
    dialog.hide()
  }

  const handleOnChange = () => {
    dispatch(`pickDate`, { name, date: inputRef.value })
    dialog.hide()
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
</svelte:head>

<div {style} class={classes} class:error class:pr-4={$$slots.default}>
  <label for={id} class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
    <slot name="label">{label}</slot>
  </label>
  <div class="relative flex items-center justify-between gap-2">
    <Button variant="ghost" color="gray" on:click={onOpen} class="w-full justify-start p-0 px-1" {isDisabled}>
      {#if value}
        {#if type === `date`}
          {formatDate(value)}
        {:else if type === `datetime`}
          {formatDateTime(value)}
        {:else}
          {formatTime(value)}
        {/if}
      {:else}
        &nbsp;
        <span class="sr-only">No date selected</span>
      {/if}
    </Button>
    <input {id} {value} required={isRequired} type="text" class="sr-only w-full" />
    <slot />

    {#if error}
      <ExclamationCircleIcon class="text-red-500" />
    {/if}
  </div>

  {#if error}
    <p class="mt-2 text-xs text-red-600">
      {error}
    </p>
  {/if}
</div>

<Dialog bind:dialog size="xs" closeOnOverlayClick>
  <div slot="header" class="flex items-center justify-between">
    <h2 class="text-md text-center font-semibold text-gray-900">
      {#if value}
        {#if type === `date`}
          {formatDate(value)}
        {:else if type === `datetime`}
          {formatDateTime(value)}
        {:else}
          {formatTime(value)}
        {/if}
      {:else}
        No date selected
      {/if}
    </h2>
    <Button on:click={dialog.hide} variant="outlined" color="blue" class="p-1">
      <span class="sr-only">Close</span>
      <XMarkIcon />
    </Button>
  </div>

  <div slot="content" class="-mb-2 -mt-4 flex flex-col items-center justify-center gap-4">
    <input {name} bind:this={inputRef} type="text" class="hidden" {placeholder} on:change={handleOnChange} />
    <div class="flex w-full items-center justify-around">
      {#if !noClear}
        <Button variant="ghost" on:click={onClear}>Clear</Button>
      {/if}
    </div>
  </div>
</Dialog>

<style>
  .wrapper {
    border: 1px solid var(--border-color);
  }

  .wrapper:focus-within {
    border-color: transparent;
    box-shadow: var(--normal-ring-focus);
  }

  .wrapper.error {
    border: 1px solid var(--error-border-color);
  }

  .wrapper.error:focus-within {
    border-color: transparent;
    box-shadow: var(--error-ring-focus);
  }

  label {
    color: var(--text-color);
  }

  label.isRequired:after {
    color: #e32;
    content: " *";
    display: inline;
  }

  input:focus {
    box-shadow: none;
  }

  :global(.flatpickr-wrapper) {
    width: 100%;
  }

  :global(.flatpickr-calendar) {
    box-shadow: none !important;
  }
</style>
