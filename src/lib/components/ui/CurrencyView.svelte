<script>
  export let amount = 0
  export let size = `sm` // "sm" | "lg"
  export let isSidebar = false
</script>

<span
  class="inline-flex items-center rounded-md px-2.5 py-1 font-semibold tabular-nums"
  class:text-xs={size === `sm`}
  class:text-lg={size === `lg`}
  class:bg-red-50={amount < 0}
  class:bg-green-50={amount > 0}
  class:bg-gray-100={amount == 0 && !isSidebar}
  class:bg-gray-700={amount == 0 && isSidebar}
  class:text-red-800={amount < 0}
  class:text-green-800={amount > 0}
  class:text-gray-800={amount == 0 && !isSidebar}
  class:text-gray-200={amount == 0 && isSidebar}
>
  {parseFloat(amount)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, `,`)}
</span>
