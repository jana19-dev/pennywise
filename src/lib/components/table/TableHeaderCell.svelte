<script>
  export let colspan = 1
  export let bg = `white` // blue
</script>

<th
  scope="col"
  {colspan}
  class="sticky top-0 z-10 border-b py-4 pl-4 pr-3 text-left text-xs font-semibold backdrop-blur backdrop-filter"
  class:bg-blue-800={bg === `blue`}
  class:bg-white={bg === `white`}
  class:border-blue-800={bg === `blue`}
  class:border-gray-200={bg === `white`}
  class:text-gray-900={bg === `white`}
  class:text-white={bg === `blue`}
>
  <slot />
</th>
