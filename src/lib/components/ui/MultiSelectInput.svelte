<script>
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let placeholder = ``
  export let isRequired = false
  export let label = `Select menu`
  export let isLoading = false
  export let error = ``
  export let values = [`apple`] // or ['apple', 'banana']
  export let options = [
    { label: `Apple`, value: `apple` },
    { label: `Banana`, value: `banana` },
    { label: `Orange`, value: `orange` }
  ]
  export let inputClass = ``
  export let hideIcon = false
  export let id = `${name}-${Math.random()}`
  export let direction = `bottom` // top, bottom

  import { createEventDispatcher } from "svelte"
  import { twMerge } from "tailwind-merge"
  import clickOutside from "$lib/utils/client/clickOutside"
  import { stopTyping } from "$lib/utils/client/stopTyping.js"

  import CheckOutlineIcon from "$lib/components/icons/CheckOutlineIcon.svelte"
  import ChevronUpDownIcon from "$lib/components/icons/ChevronUpDownIcon.svelte"
  import ExclamationCircleIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
  import LoadingSpinnerIcon from "$lib/components/icons/LoadingSpinnerIcon.svelte"
  import colors from "$lib/utils/client/colors"

  const colorObject = colors[color]
  const style = Object.entries({
    "--border-color": colorObject[`300`],
    "--error-border-color": colors[`red`][`500`],
    "--normal-ring": `0 0 0 1px ${colorObject[`300`]}`,
    "--normal-ring-focus": `0 0 0 2px ${colorObject[`600`]}`,
    "--error-ring-focus": `0 0 0 2px ${colors[`red`][`600`]}`,
    "--text-color": colorObject[`900`],
    "--error-text-color": colors[`red`][`600`],
    "--button-color": colorObject[`500`]
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  const classes = twMerge(`wrapper relative h-fit w-auto rounded-md border p-1 shadow-sm`, $$props.class)

  let inputRef = null
  let isOptionsOpen = false
  let isActive = null

  let searchValue = ``

  const dispatch = createEventDispatcher()

  const onSelect = (option) => {
    if (values.includes(option.value)) {
      values = values.filter((v) => v !== option.value)
    } else {
      values = [...values, option.value]
    }
    searchValue = ``
    inputRef.focus()
    dispatch(`select`, { name, options: options.filter((option) => values.includes(option.value)) })
    isOptionsOpen = false
  }

  const onClose = () => {
    isOptionsOpen = false
    searchValue = ``
  }

  // cycle focus on li options with keyboard up or down
  const onKeyDown = (e) => {
    if (!isOptionsOpen) return
    // close on escape or tab out
    if (e.key === `Escape` || e.key === `Tab`) {
      onClose()
      return
    }
    // get all li elements
    const options = document.querySelectorAll(`#options li`)
    // cycle focus on li elements with keyboard up or down
    if (e.key === `ArrowDown`) {
      e.preventDefault()
      if (isActive === null) {
        isActive = 0
      } else {
        isActive = (isActive + 1) % options.length
      }
      options[isActive] && options[isActive].focus()
    } else if (e.key === `ArrowUp`) {
      e.preventDefault()
      if (isActive === null) {
        isActive = 0
      } else {
        isActive = (isActive - 1 + options.length) % options.length
      }
      options[isActive] && options[isActive].focus()
    } else {
      // focus on input on any other except Enter
      if (e.key !== `Enter`) {
        inputRef.focus()
      }
    }
  }
</script>

<div use:clickOutside on:clickOutside={onClose} {style} class={classes} on:keydown={onKeyDown} role="button" tabindex="0">
  <label for={id} class="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium" class:isRequired>
    <slot name="label">{label}</slot>
  </label>
  <div class="relative">
    <div class="flex items-center justify-between">
      <input
        {id}
        {name}
        use:stopTyping
        on:stopTyping
        placeholder={options
          .filter((option) => values.includes(option.value))
          .map((option) => option.label)
          .join(`, `) || placeholder}
        bind:this={inputRef}
        required={isRequired}
        bind:value={searchValue}
        on:click={() => {
          isOptionsOpen = true
        }}
        on:keyup={(e) => {
          if (e.key === `Escape` || e.key === `Tab`) {
            return
          }
          if (isOptionsOpen && e.key === `Enter`) {
            const matchingOptions = options.filter((option) => option.label.toLowerCase().startsWith(searchValue.toLowerCase()))
            if (matchingOptions.length === 1) {
              onSelect(matchingOptions[0])
              return
            }
          }
          if (!isOptionsOpen) {
            isOptionsOpen = true
          }
        }}
        type="text"
        class={twMerge(`w-full rounded-md border-none bg-white p-2 text-sm outline-none`, inputClass)}
        role="combobox"
        aria-controls="options"
        aria-expanded="false"
      />

      <slot />

      {#if error}
        <div class="inset-y-0 right-0 flex items-center">
          <ExclamationCircleIcon class="text-red-500" />
        </div>
      {/if}
      {#if !hideIcon}
        <button
          type="button"
          on:click={() => {
            isOptionsOpen = true
          }}
          class="flex items-center rounded-r-md px-2 focus:outline-none"
          tabindex="-1"
        >
          <ChevronUpDownIcon class="text-{color}-400" />
        </button>
      {/if}
    </div>
    {#if error}
      <p class="ml-3 text-xs text-red-600" id="{label}-error">
        {error}
      </p>
    {/if}

    {#if isOptionsOpen}
      <ul
        class="options absolute z-20 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm"
        class:bottom-0={direction === `top`}
        class:top-0={direction === `bottom`}
        class:mt-8={direction === `bottom`}
        class:mb-10={direction === `top`}
        id="options"
      >
        {#if isLoading}
          <li class="relative cursor-default select-none rounded-md py-2 pl-3 pr-9 focus:outline-none">
            <div class="flex items-center gap-1">
              <LoadingSpinnerIcon class="text-{color}-500 mr-2" />
              Loading...
            </div>
          </li>
        {:else}
          {#each options.filter(({ label }) => label
              .toLowerCase()
              .trim()
              .startsWith(searchValue.toLowerCase().trim())) as option, idx (option.value)}
            {@const isSelected = values.includes(option.value)}
            <li
              class="relative cursor-default select-none rounded-md py-2 pl-3 pr-9 focus:outline-none"
              on:mouseenter={() => (isActive = idx)}
              on:mouseleave={() => (isActive = null)}
              on:click={() => {
                onSelect(option)
              }}
              on:keyup={(event) => {
                if (event.key === `Enter`) {
                  onSelect(option)
                }
              }}
              role="option"
              aria-selected={isSelected}
              class:text-white={isActive === idx}
              class:bg-blue-600={color === `blue` && isActive === idx}
              class:bg-red-600={color === `red` && isActive === idx}
              class:bg-green-600={color === `green` && isActive === idx}
              class:bg-yellow-600={color === `yellow` && isActive === idx}
              class:bg-gray-600={color === `gray` && isActive === idx}
              class:text-gray-900={isActive !== idx}
              id={option.label}
              tabindex="-1"
            >
              <span class="block truncate" class:font-semibold={isSelected}>{option.label}</span>

              {#if isSelected && option?.value}
                <span
                  class="absolute inset-y-0 right-0 flex items-center pr-4"
                  class:text-white={isActive === idx}
                  class:text-blue-600={color === `blue` && isActive !== idx}
                  class:text-red-600={color === `red` && isActive !== idx}
                  class:text-green-600={color === `green` && isActive !== idx}
                  class:text-yellow-600={color === `yellow` && isActive !== idx}
                  class:text-gray-600={color === `gray` && isActive !== idx}
                >
                  <CheckOutlineIcon />
                </span>
              {/if}
            </li>
          {:else}
            <li class="relative cursor-default select-none rounded-md py-2 pl-3 pr-9 focus:outline-none">
              <div class="flex items-center gap-1">
                <ExclamationCircleIcon class="text-red-500" />
                No options found
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    {/if}
  </div>
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

  .isRequired:after {
    color: #e32;
    content: " *";
    display: isInline;
  }

  button {
    color: var(--button-color);
  }

  .options {
    box-shadow: var(--normal-ring);
  }

  input:focus {
    box-shadow: none;
  }
</style>
