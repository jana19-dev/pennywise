<script>
  import { isSidebarOpenStore } from "$lib/stores"
</script>

<button
  on:click={() => {
    $isSidebarOpenStore = true
  }}
  class="text-gray-500 focus:outline-none lg:hidden"
  aria-label="Toggle sidebar"
>
  <div
    class="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
  >
    <img src="/logo.png" alt="budget logo" class="h-10 w-10" />
    <div class="relative focus:outline-none focus:ring-2 focus:ring-indigo-500">
      <h1 class="mx-2 text-xl font-semibold tracking-wider text-blue-900">PennyWise</h1>
    </div>
  </div>
</button>
