<script>
  import { page } from "$app/stores"

  import { Dialog, Button } from "@codepiercer/svelte-tailwind"

  let dialog
</script>

<Button
  on:click={dialog.show}
  color="gray"
  variant="primary"
  class="my-1 w-full justify-between gap-2 px-2"
>
  <img
    class="inline-block h-8 w-8 rounded-full"
    src={$page.data.session.user.image}
    alt={$page.data.session.user.name}
  />
  <span class="flex flex-col gap-1 text-right text-xs">
    <p class="text-md font-semibold text-gray-50">
      {$page.data.session.user.name}
    </p>
    <p class=" font-medium text-gray-300">
      {$page.data.session.user.email}
    </p>
  </span>
</Button>

<Dialog bind:dialog closeOnOverlayClick class="w-full max-w-md">
  <div slot="header" class="flex flex-col gap-1">
    <p class="text-md font-semibold text-gray-900">
      {$page.data.session.user.name}
    </p>
    <p class=" font-medium text-gray-500">
      {$page.data.session.user.email}
    </p>
  </div>

  <div slot="content">Show Something</div>
</Dialog>
