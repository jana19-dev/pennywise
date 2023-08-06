<script>
  export let color = `blue` // blue, red, green, yellow, gray
  export let name = `fieldName`
  export let value = ``
</script>

<div class="relative flex items-center bg-white">
  <button
    {name}
    type="button"
    disabled
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-default rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
    class:bg-gray-200={!value}
    class:bg-blue-600={!!value && color === `blue`}
    class:bg-red-600={!!value && color === `red`}
    class:bg-green-600={!!value && color === `green`}
    class:bg-yellow-600={!!value && color === `yellow`}
    class:bg-gray-600={!!value && color === `gray`}
    role="switch"
    aria-checked={!!value}
  >
    <span class="sr-only">Use setting</span>
    <span
      class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
      class:translate-x-0={!value}
      class:translate-x-5={!!value}
    >
      <span
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        class:opacity-100={!value}
        class:ease-in={!value}
        class:duration-200={!value}
        class:opacity-0={!!value}
        class:ease-out={!!value}
        class:duration-100={!!value}
        aria-hidden="true"
      >
        <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
          <path
            d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        class:opacity-0={!value}
        class:ease-out={!value}
        class:duration-100={!value}
        class:opacity-100={!!value}
        class:ease-in={!!value}
        class:duration-200={!!value}
        aria-hidden="true"
      >
        <svg class="h-3 w-3 text-{color}-600" fill="currentColor" viewBox="0 0 12 12">
          <path
            d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
          />
        </svg>
      </span>
    </span>
  </button>
</div>
