<script>
  import { page } from "$app/stores"

  import Sidebar from "$lib/components/sidebar/Sidebar.svelte"
  import SidebarToggle from "$lib/components/sidebar/SidebarToggle.svelte"
</script>

<svelte:head>
  <title>{$page.data?.title || ``} | Budget</title>
</svelte:head>

<div class="flex h-full w-full">
  <Sidebar />

  <div class="flex flex-1 flex-col overflow-hidden">
    <header
      class="flex items-center justify-between border-b-2 border-gray-100 py-2 px-3 lg:hidden"
    >
      <SidebarToggle />

      <div class="min-w-0 lg:flex-1">
        <h1 class="text-xl font-medium leading-6 text-gray-900 sm:truncate">
          {$page.data?.title || ``}
        </h1>
      </div>
    </header>

    <main class="mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100">
      <slot />
    </main>
  </div>
</div>
