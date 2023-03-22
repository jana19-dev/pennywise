<script>
  export let count = 0
  export let metrics = {}
  export let queryResult

  import { Button } from "@codepiercer/svelte-tailwind"

  import RefetchIcon from "$lib/components/icons/RefetchIcon.svelte"
  import LoadMoreIcon from "$lib/components/icons/LoadMoreIcon.svelte"
</script>

<div
  class="flex items-center justify-between gap-2 bg-blue-50 p-2 text-sm text-blue-500"
  class:pointer-events-none={$queryResult.isLoading || $queryResult.isFetching}
>
  <div class="flex flex-col gap-4 lg:flex-1 lg:flex-row ">
    <div class="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="h-5 w-5"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
          clip-rule="evenodd"
        />
      </svg>
      {#if $queryResult.isLoading || $queryResult.isFetching}
        <p class="font-semibold text-blue-800">Loading metrics ...</p>
      {:else}
        <p class=" text-blue-800">
          Showing <span class="font-semibold">{count}</span>
          {#if metrics.allCount}
            of <span class="font-semibold">{metrics.filteredCount}</span>
            {metrics.allCount !== metrics.filteredCount ? `(${metrics.allCount})` : ``}
          {/if}
        </p>
      {/if}
    </div>
    <slot />
  </div>

  <div class="flex items-center gap-6">
    <slot name="toggleColumns" />
    <Button
      class="max-w-fit p-1.5"
      color="blue"
      variant="secondary"
      isDisabled={!$queryResult.hasNextPage}
      on:click={$queryResult.fetchNextPage}
      isLoading={$queryResult.isFetchingNextPage}
      ><LoadMoreIcon /><span class="ml-1 hidden lg:block">load more</span>
      <span class="sr-only">load more</span>
    </Button>

    <Button
      class="max-w-fit p-1.5"
      color="blue"
      variant="secondary"
      on:click={$queryResult.refetch}
      isLoading={$queryResult.isRefetching}
      ><RefetchIcon /><span class="ml-1 hidden lg:block">refetch</span>
      <span class="sr-only">refetch</span>
    </Button>
  </div>
</div>
