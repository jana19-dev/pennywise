<script>
  export let colspan = 1
</script>

<th
  scope="col"
  {colspan}
  class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-80 py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 backdrop-blur backdrop-filter"
  ><slot /></th
>
