<script>
  export let columns = []

  import { DropdownMenu, Button } from "@codepiercer/svelte-tailwind"
  import { hiddenColumnsStore } from "$lib/stores"
</script>

<DropdownMenu
  let:menuItemProps
  let:triggerProps
  color="gray"
  let:onOpen
  let:closeMenu
  placement="bottom-left"
>
  <Button
    slot="trigger"
    on:click={onOpen}
    {...triggerProps}
    color="blue"
    variant="ghost"
    class="p-1"
  >
    <span class="sr-only">toggle columns visibility</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
      <path
        d="M14 17h2.75A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H14v14zM12.5 3h-5v14h5V3zM3.25 3H6v14H3.25A2.25 2.25 0 011 14.75v-9.5A2.25 2.25 0 013.25 3z"
      />
    </svg>
  </Button>
  <div slot="content" class="min-w-[12rem] p-1.5">
    <div class="flex flex-col gap-2 bg-white" role="none">
      {#each columns as column}
        {@const isHidden = $hiddenColumnsStore.includes(column)}
        <Button
          {...menuItemProps}
          on:click={() => {
            if (!isHidden) {
              $hiddenColumnsStore = [...$hiddenColumnsStore, column]
            } else {
              $hiddenColumnsStore = $hiddenColumnsStore.filter((c) => c !== column)
            }
          }}
          variant="ghost"
          color="gray"
          class="inline-flex items-center justify-between gap-1 p-1 text-left text-xs"
        >
          <div class="truncate">
            {column.replace(/([A-Z])/g, ` $1`).replace(/^./, (str) => str.toUpperCase())}
          </div>
          <div>
            {#if !isHidden}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-4 w-4 text-blue-500/80"
              >
                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                <path
                  fill-rule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd"
                />
              </svg>
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="h-4 w-4 text-gray-500/80"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                  clip-rule="evenodd"
                />
                <path
                  d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z"
                />
              </svg>
            {/if}
          </div>
        </Button>
      {/each}
    </div>
  </div>
</DropdownMenu>
