<script>
  export let label = ``
  export let orderByField = ``

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"

  $: activeOrderBy = $page.url.searchParams.get(`orderBy`)
  $: isThisFieldActive = activeOrderBy === orderByField || activeOrderBy === `-${orderByField}`

  const handleSort = () => {
    const searchParams = new URLSearchParams($page.url.searchParams.toString())
    if (searchParams.get(`orderBy`)?.includes(orderByField)) {
      if (searchParams.get(`orderBy`).startsWith(`-`)) {
        searchParams.delete(`orderBy`)
      } else {
        searchParams.set(`orderBy`, `-${orderByField}`)
      }
    } else {
      searchParams.set(`orderBy`, orderByField)
    }
    goto(`?${searchParams.toString()}`)
  }
</script>

<div class="flex cursor-pointer items-center gap-1" on:click|preventDefault={handleSort} on:keyup={handleSort} role="button" tabindex="0">
  <slot>{label}</slot>
  {#if isThisFieldActive}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 rounded-md bg-yellow-200">
      {#if activeOrderBy !== orderByField}
        <path
          fill-rule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
          clip-rule="evenodd"
        />
      {:else}
        <path
          fill-rule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
          clip-rule="evenodd"
        />
      {/if}
    </svg>
  {/if}
</div>
