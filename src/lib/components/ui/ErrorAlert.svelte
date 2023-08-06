<script>
  import ExclamationIcon from "$lib/components/icons/ExclamationCircleIcon.svelte"
</script>

<div class="rounded-md bg-red-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <ExclamationIcon class="text-red-500" />
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-red-800">
        <slot>Error.</slot>
      </h3>
      {#if $$slots.details}
        <div class="mt-2 text-sm text-red-700">
          <slot name="details" />
        </div>
      {/if}
    </div>
  </div>
</div>
