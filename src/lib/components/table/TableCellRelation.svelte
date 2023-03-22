<script>
  export let onView
  export let onAddNew = null
  export let count = null
  export let label

  import { Button } from "@codepiercer/svelte-tailwind"
  import PlusIcon from "@codepiercer/svelte-tailwind/icons/PlusIcon.svelte"
</script>

<div class="inline-flex w-full items-center rounded-md shadow-sm">
  <Button
    isDisabled={count === 0}
    class={onAddNew
      ? `w-full justify-start rounded-r-none p-0`
      : `w-full justify-start rounded-md p-0`}
    variant="outlined"
    color="gray"
    on:click={onView}
  >
    <slot />
    <slot name="label">
      <span class="max-w-[12rem] truncate text-ellipsis text-xs">
        {#if label}
          {#if count > 1}
            {label}s
          {:else}
            {label}&nbsp;
          {/if}
        {:else}
          &nbsp;
        {/if}
      </span>
    </slot>
  </Button>

  {#if onAddNew}
    <Button on:click={onAddNew} variant="outlined" class="rounded-l-none p-0" color="gray">
      <span class="sr-only">Add new</span>
      <PlusIcon class="text-gray-400" />
    </Button>
  {/if}
</div>
