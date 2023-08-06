<script>
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let label = name // use name if label is not provided
  export let isRequired = false
  export let isTouched = false
  export let error = ``
  export let value = ``

  import { createEventDispatcher } from "svelte"
  import { twMerge } from "tailwind-merge"

  import ExclamationCircleIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
  import colors from "$lib/utils/client/colors"

  const colorObject = colors[color]
  const style = Object.entries({
    "--border-color": colorObject[`300`],
    "--error-border-color": colors[`red`][`500`],
    "--normal-ring-focus": `0 0 0 2px ${colorObject[`600`]}`,
    "--error-ring-focus": `0 0 0 2px ${colors[`red`][`600`]}`,
    "--text-color": colorObject[`900`],
    "--error-text-color": colors[`red`][`600`],
    "--button-color": colorObject[`500`]
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  const classes = twMerge(`relative rounded-md border px-4 py-3 shadow-sm h-fit w-auto wrapper`, $$props.class)

  const dispatch = createEventDispatcher()

  const onToggle = () => {
    value = !value
    dispatch(`toggle`)
  }
</script>

<div {style} class={classes} class:error>
  <span class="label absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
    <slot name="label">{label}</slot>
  </span>
  <div class="relative flex items-center justify-between">
    <button
      {name}
      type="button"
      class="relative mx-auto inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
      class:bg-gray-200={!value}
      class:bg-blue-600={!!value && color === `blue`}
      class:bg-red-600={!!value && color === `red`}
      class:bg-green-600={!!value && color === `green`}
      class:bg-yellow-600={!!value && color === `yellow`}
      class:bg-gray-600={!!value && color === `gray`}
      role="switch"
      aria-checked={!!value}
      on:click={onToggle}
    >
      <span class="sr-only">Use setting</span>
      <span
        class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
        class:translate-x-0={!value}
        class:translate-x-5={!!value}
      >
        <span
          class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          class:opacity-100={!value}
          class:ease-in={!value}
          class:duration-200={!value}
          class:opacity-0={!!value}
          class:ease-out={!!value}
          class:duration-100={!!value}
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          class:opacity-0={!value}
          class:ease-out={!value}
          class:duration-100={!value}
          class:opacity-100={!!value}
          class:ease-in={!!value}
          class:duration-200={!!value}
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-{color}-600" fill="currentColor" viewBox="0 0 12 12">
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </button>

    <slot />

    {#if error}
      <div class="inset-y-0 right-0 flex items-center">
        <ExclamationCircleIcon class="text-red-500" />
      </div>
    {/if}
  </div>
  {#if error && isTouched}
    <p class="mt-2 text-xs text-red-600" id="{label}-error">
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

  .label {
    color: var(--text-color);
  }

  .label.isRequired:after {
    color: #e32;
    content: " *";
    display: isInline;
  }
</style>
