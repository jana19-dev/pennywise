<script>
  export let variant = `primary` // primary, secondary, outlined, ghost
  export let color = `blue` // blue, red, green, yellow, gray
  export let size = `md` // sm, md, lg
  export let isDisabled = false
  export let isLoading = false
  export let href = `` // if href is provided, the button will be rendered as an anchor tag

  import colors from "$lib/utils/client/colors"
  import LoadingSpinnerIcon from "$lib/components/icons/LoadingSpinnerIcon.svelte"
  import { twMerge } from "tailwind-merge"

  const colorObject = colors[color]
  const style = Object.entries({
    "--primary-bg-color": colorObject[`600`],
    "--primary-bg-color-hover": colorObject[`700`],
    "--secondary-bg-color": colorObject[`100`],
    "--secondary-bg-color-hover": colorObject[`200`],
    "--text-color": colorObject[`700`],
    "--outlined-bg-color-hover": colorObject[`50`],
    "--ghost-bg-color-hover": colorObject[`100`],
    "--normal-ring": `0 0 0 1px ${colorObject[`200`]}`,
    "--normal-ring-focus": `0 0 0 2px ${colorObject[`50`]}, 0 0 0 4px ${colorObject[`500`]}`,
    "--normal-ring-hover": `0 0 0 2px ${colorObject[`300`]}`,
    "--ghost-ring-focus": `0 0 0 1px ${colorObject[`200`]}`,
    "--disabled-bg-color": colors[`gray`][`200`],
    "--disabled-ring": `0 0 0 1px ${colors[`gray`][`100`]}`,
    "--disabled-ring-focus": `0 0 0 1px ${colors[`gray`][`100`]}`,
    "--disabled-ring-hover": `0 0 0 1px ${colors[`gray`][`100`]}`,
    "--disabled-text-color": colors[`gray`][`500`]
  })
    .map(([key, value]) => `${key}: ${value}`)
    .join(`;`)

  let classes = `inline-flex items-center justify-center h-fit rounded-md border border-transparent font-medium transition focus:outline-none`

  if (size === `sm`) {
    classes = twMerge(classes, `px-2.5 py-1.5 text-xs`)
  } else if (size === `md`) {
    classes = twMerge(classes, `px-4 py-2 text-sm`)
  } else if (size === `lg`) {
    classes = twMerge(classes, `px-6 py-3 text-base`)
  }

  const { class: restPropsClass, ...restProps } = $$restProps
  classes = twMerge(classes, restPropsClass)
</script>

{#if href !== ``}
  <a
    {href}
    on:click={(e) => {
      if (isDisabled || isLoading) {
        e.preventDefault()
      }
    }}
    tabindex={isDisabled ? -1 : 0}
    {style}
    class:primary={variant === `primary`}
    class:secondary={variant === `secondary`}
    class:outlined={variant === `outlined`}
    class:ghost={variant === `ghost`}
    class:isDisabled
    class:isLoading
    class={classes}
    {...restProps}
  >
    {#if isLoading}
      <LoadingSpinnerIcon {color} class="mr-2" />
    {/if}
    <slot />
  </a>
{:else}
  <button
    on:click
    on:mouseleave
    on:mouseenter
    type="button"
    disabled={isDisabled || isLoading}
    {style}
    class:primary={variant === `primary`}
    class:secondary={variant === `secondary`}
    class:outlined={variant === `outlined`}
    class:ghost={variant === `ghost`}
    class:isDisabled
    class:isLoading
    class={classes}
    {...restProps}
  >
    {#if isLoading}
      <LoadingSpinnerIcon {color} class="mr-2" />
    {/if}
    <slot />
  </button>
{/if}

<style>
  button,
  a {
    color: var(--text-color);
  }

  .primary {
    color: #fff;
    background-color: var(--primary-bg-color);
  }
  .primary:hover {
    background-color: var(--primary-bg-color-hover);
  }

  .secondary {
    background-color: var(--secondary-bg-color);
  }
  .secondary:hover {
    background-color: var(--secondary-bg-color-hover);
  }

  .outlined:hover {
    background-color: var(--outlined-bg-color-hover);
  }

  .ghost:hover {
    background-color: var(--ghost-bg-color-hover);
  }

  .primary,
  .secondary,
  .outlined {
    box-shadow: var(--normal-ring);
  }

  .primary:hover,
  .secondary:hover,
  .outlined:hover {
    box-shadow: var(--normal-ring-hover);
  }

  .primary:focus,
  .secondary:focus,
  .outlined:focus {
    box-shadow: var(--normal-ring-focus);
  }

  .ghost:focus {
    box-shadow: var(--ghost-ring-focus);
  }

  .isLoading {
    pointer-events: none;
  }

  .isDisabled {
    cursor: not-allowed;
    background-color: var(--disabled-bg-color);
    color: var(--disabled-text-color);
    box-shadow: var(--disabled-ring);
  }

  .isDisabled:hover,
  .isLoading:hover {
    box-shadow: var(--disabled-ring-hover);
    background-color: var(--disabled-bg-color);
  }

  .isDisabled:focus,
  .isLoading:focus {
    box-shadow: var(--disabled-ring-focus);
  }
</style>
