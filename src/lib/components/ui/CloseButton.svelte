<script>
  import { Button } from "$lib/components/ui"

  import XMarkIcon from "$lib/components/icons/XMarkIcon.svelte"
</script>

<Button on:click variant="outlined" color="blue" class="px-2">
  <span class="sr-only">Close</span>
  <XMarkIcon />
</Button>
