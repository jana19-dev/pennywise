<script>
  export let link

  import { page } from "$app/stores"

  $: isActive =
    $page.url.pathname === link.href ||
    $page.url.pathname === link.alternate ||
    (link.subRoute && $page.url.pathname.startsWith(link.subRoute)) ||
    (!link.subRoute && $page.url.pathname.startsWith(link.href))
</script>

<a
  href={link.href}
  class="group flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium leading-5 transition focus:outline-none"
  class:bg-gray-600={isActive}
  class:hover:bg-gray-700={isActive}
  class:text-gray-50={isActive}
  class:text-gray-200={!isActive}
  class:hover:text-gray-100={isActive}
  class:hover:text-gray-200={!isActive}
  class:hover:bg-gray-600={!isActive}
  class:focus:bg-gray-600={isActive}
  class:focus:text-gray-50={isActive}
  class:focus:text-gray-100={!isActive}
  class:focus:bg-gray-700={!isActive}
  aria-current={isActive ? `page` : null}
>
  <svg
    class="mr-3 h-6 w-6 flex-shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="2"
    stroke="currentColor"
    aria-hidden="true"
  >
    {#each link.iconPaths as d}
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" {d} />
    {/each}
  </svg>
  {link.label}
</a>
