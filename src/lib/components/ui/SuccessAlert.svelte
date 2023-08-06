<script>
  import CheckOutlineIcon from "$lib/components/icons/CheckOutlineIcon.svelte"
</script>

<div class="rounded-md bg-green-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <CheckOutlineIcon class="text-green-500" />
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-green-800">
        <slot>Success.</slot>
      </h3>
      {#if $$slots.details}
        <div class="mt-2 text-sm text-green-700">
          <slot name="details" />
        </div>
      {/if}
    </div>
  </div>
</div>
