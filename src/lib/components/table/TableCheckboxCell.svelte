<script>
  export let id
  export let isSelected
</script>

<td
  class="relative whitespace-nowrap border-b border-gray-200 pl-4 pr-3 text-sm font-medium text-gray-900"
>
  <!-- Selected row marker, only show when row is selected. -->
  {#if isSelected}
    <div class="absolute inset-y-0 left-0 w-1 bg-yellow-600" />
  {/if}

  <label for={id} class="sr-only">Select row</label>

  <input
    {id}
    type="checkbox"
    checked={isSelected}
    on:change
    class=" h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 sm:left-6"
  />
</td>
