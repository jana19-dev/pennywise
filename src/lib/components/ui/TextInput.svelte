<script>
  export let type = `text` // text, email, password, number, tel, url
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let label = name // use name if label is not provided
  export let placeholder = ``
  export let isRequired = false
  export let isTouched = false
  export let error = ``
  export let value = ``
  export let mask = null
  export let inputClass = ``
  export let inputProps = {}
  export let id = `${name}-${Math.random()}`

  import { twMerge } from "tailwind-merge"
  import { stopTyping } from "$lib/utils/client/stopTyping.js"
  import { imask } from "@imask/svelte"

  import ExclamationCircleIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
  import EyeIcon from "$lib/components/icons/EyeIcon.svelte"
  import EyeSlashIcon from "$lib/components/icons/EyeSlashIcon.svelte"
  import colors from "$lib/utils/client/colors"

  let inputRef

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

  function typeAction(node) {
    node.type = type
  }
</script>

<div {style} class={classes} class:error>
  <label for={id} class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
    <slot name="label">{label}</slot>
  </label>
  <div class="relative flex items-center justify-between">
    <input
      use:imask={mask ? { mask } : null}
      use:stopTyping
      on:stopTyping
      use:typeAction
      bind:this={inputRef}
      {id}
      required={isRequired}
      {name}
      on:change
      on:keyup|trusted
      bind:value
      class={twMerge(`block w-full border-0 p-0 text-sm text-gray-900`, inputClass)}
      {placeholder}
      {...inputProps}
    />

    {#if type === `password`}
      <button
        tabindex="-1"
        type="button"
        class="mr-1 block text-sm font-medium text-gray-700"
        on:click={() => {
          inputRef.type = inputRef.type === `password` ? `text` : `password`
        }}
      >
        {#if inputRef && inputRef.type === `text`}
          <EyeSlashIcon />
          <span class="sr-only">Hide password</span>
        {:else}
          <EyeIcon />
          <span class="sr-only">Show password</span>
        {/if}
      </button>
    {/if}

    <slot />

    {#if error}
      <div id="error" class="inset-y-0 right-0 flex items-center">
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

  label {
    color: var(--text-color);
  }

  label.isRequired:after {
    color: #e32;
    content: " *";
    display: isInline;
  }

  button {
    color: var(--button-color);
  }

  input:focus {
    box-shadow: none;
  }
</style>
