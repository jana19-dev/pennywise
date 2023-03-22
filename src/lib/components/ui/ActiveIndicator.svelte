<script>
  export let color = `orange`

  import { twMerge } from "tailwind-merge"
</script>

<div class={twMerge(`absolute top-0 right-0 -mt-2 -mr-2 flex`, $$props.class)}>
  <span class="absolute inline-flex animate-ping">
    <span
      class="inline-flex h-4 w-4 rounded-full opacity-75"
      class:bg-red-400={color === `red`}
      class:bg-orange-400={color === `orange`}
    />
  </span>
  <span
    class="relative inline-flex h-4 w-4 rounded-full"
    class:bg-red-500={color === `red`}
    class:bg-orange-500={color === `orange`}
  />
</div>
