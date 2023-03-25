<script>
  export let link
  export let color = `gray` // "gray" | "indigo"
  export let iconOnly = false

  import { page } from "$app/stores"

  $: isActive =
    $page.url.pathname === link.href ||
    $page.url.pathname === link.alternate ||
    (link.subRoute && $page.url.pathname.startsWith(link.subRoute)) ||
    (!link.subRoute && $page.url.pathname.startsWith(link.href))
</script>

<a
  href={link.href}
  class="group flex w-full items-center justify-between rounded-md py-1 text-xs font-medium leading-5 transition focus:outline-none"
  class:px-1={iconOnly}
  class:py-2={!iconOnly}
  class:bg-gray-600={isActive && color === `gray`}
  class:hover:bg-gray-700={isActive && color === `gray`}
  class:text-gray-50={isActive && color === `gray`}
  class:text-gray-200={!isActive && color === `gray`}
  class:hover:text-gray-100={isActive && color === `gray`}
  class:hover:text-gray-200={!isActive && color === `gray`}
  class:hover:bg-gray-600={!isActive && color === `gray`}
  class:focus:bg-gray-600={isActive && color === `gray`}
  class:focus:text-gray-50={isActive && color === `gray`}
  class:focus:text-gray-100={!isActive && color === `gray`}
  class:focus:bg-gray-700={!isActive && color === `gray`}
  class:bg-indigo-600={isActive && color === `indigo`}
  class:hover:bg-indigo-700={isActive && color === `indigo`}
  class:text-indigo-50={isActive && color === `indigo`}
  class:text-indigo-100={!isActive && color === `indigo`}
  class:hover:text-indigo-50={isActive && color === `indigo`}
  class:hover:text-indigo-100={!isActive && color === `indigo`}
  class:hover:bg-indigo-600={!isActive && color === `indigo`}
  class:focus:bg-indigo-600={isActive && color === `indigo`}
  class:focus:text-indigo-50={isActive && color === `indigo`}
  class:focus:text-indigo-100={!isActive && color === `indigo`}
  class:focus:bg-indigo-700={!isActive && color === `indigo`}
  aria-current={isActive ? `page` : null}
>
  <div class="flex items-center">
    <svg
      class="h-6 w-6 flex-shrink-0"
      class:ml-2={iconOnly}
      class:mr-3={!iconOnly}
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
    {#if !iconOnly}
      {link.label}
    {/if}
  </div>
  <slot />
</a>
