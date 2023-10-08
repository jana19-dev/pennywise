<script>
  export let count
  export let color = `green` // green, red, yellow, blue
</script>

<span
  class="inline-flex rounded-md px-2 text-xs font-semibold tabular-nums leading-5"
  class:bg-green-100={count > 0 && color === `green`}
  class:text-green-800={count > 0 && color === `green`}
  class:bg-red-100={count > 0 && color === `red`}
  class:text-red-800={count > 0 && color === `red`}
  class:bg-yellow-100={count > 0 && color === `yellow`}
  class:text-yellow-800={count > 0 && color === `yellow`}
  class:bg-blue-100={count > 0 && color === `blue`}
  class:text-blue-800={count > 0 && color === `blue`}
>
  {count}
</span>
