<script>
  import LoadingSpinnerIcon from "$lib/components/icons/LoadingSpinnerIcon.svelte"
</script>

<div class="rounded-md bg-yellow-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <LoadingSpinnerIcon color="yellow" />
    </div>
    <div class="ml-3">
      <p class="text-sm font-medium text-yellow-800"><slot>Loading...</slot></p>
    </div>
  </div>
</div>
