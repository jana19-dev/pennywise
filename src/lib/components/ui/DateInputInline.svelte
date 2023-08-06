<script>
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let type = `datetime` // date, datetime, time
  export let label = name // use name if label is not provided
  export let placeholder = ``
  export let isRequired = false
  export let error = ``
  export let value = ``
  export let options = {}
  export let inputClass = ``
  export let id = `${name}-${Math.random()}`

  import { onMount, tick } from "svelte"
  import { createEventDispatcher } from "svelte"

  import flatpickr from "flatpickr"
  import { twMerge } from "tailwind-merge"

  import Button from "./Button.svelte"
  import XMarkIcon from "$lib/components/icons/XMarkIcon.svelte"
  import ExclamationCircleIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
  import colors from "$lib/utils/client/colors"
  import { formatDate, formatTime, formatDateTime } from "$lib/utils/client/date"

  let inputRef

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

  const classes = twMerge(`relative rounded-md border px-4 py-3 shadow-sm h-fit w-auto wrapper w-full`, $$props.class)

  onMount(() => {
    flatpickr(inputRef, {
      defaultDate: value,
      inline: true,
      static: false,
      ...options,
      enableTime: type === `datetime` || type === `time`,
      noCalendar: type === `time`,
      dateFormat: type === `date` ? `Y-m-d` : `Y-m-dTH:i`
    })
  })

  $: if (value !== undefined && value !== null && inputRef) {
    inputRef._flatpickr.setDate(value)
  }

  const dispatch = createEventDispatcher()

  const onClear = async () => {
    inputRef._flatpickr.setDate(``)
    await tick()
    dispatch(`pickDate`, { name, date: `` })
  }

  const handleOnChange = () => {
    dispatch(`pickDate`, { name, date: inputRef.value })
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" />
</svelte:head>

<div {style} class={classes} class:error>
  <label for={id} class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
    <slot name="label">{label}</slot>
  </label>
  <div class="relative flex flex-col items-center justify-between gap-2">
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
    <input
      {id}
      {name}
      bind:this={inputRef}
      required={isRequired}
      type="text"
      class={twMerge(`sr-only w-full border-0 p-0 text-sm text-gray-900`, inputClass)}
      {placeholder}
      on:change={handleOnChange}
    />

    <div class="flex w-full items-center justify-around">
      {#if inputRef?.value}
        <Button {color} variant="ghost" on:click={onClear}>
          <XMarkIcon />
          <span>Clear</span>
        </Button>
      {/if}
    </div>

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
