<script>
  import LoginForm from "$lib/components/application/auth/mutations/LoginForm.svelte"
</script>

<svelte:head>
  <title>Login - PennyWise</title>
</svelte:head>

<div class="min-h-full bg-gray-900 ">
  <main>
    <div class="relative isolate overflow-hidden">
      <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width="200"
            height="200"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y="-1" class="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            stroke-width="0"
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          stroke-width="0"
          fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
        />
      </svg>
      <svg
        viewBox="0 0 1108 632"
        aria-hidden="true"
        class="absolute top-10 left-[calc(50%-4rem)] -z-10 w-[69.25rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
      >
        <path
          fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)"
          fill-opacity=".2"
          d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"
        />
        <defs>
          <linearGradient
            id="175c433f-44f6-4d59-93f0-c5c51ad5566d"
            x1="1220.59"
            x2="-85.053"
            y1="432.766"
            y2="638.714"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#4F46E5" />
            <stop offset="1" stop-color="#80CAFF" />
          </linearGradient>
        </defs>
      </svg>
      <div class="mx-auto max-w-7xl px-6 pb-24 pt-40 sm:pb-40 lg:flex lg:px-8">
        <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <img class="h-24" src="/logo.png" alt="PennyWise logo" />
          <div class="mt-8">
            <a href="https://jana19.dev/" class="inline-flex space-x-6">
              <span
                class="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20"
                >jana19.dev</span
              >
            </a>
          </div>
          <h1 class="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">PennyWise</h1>
          <p class="mt-6 text-lg leading-8 text-gray-300">
            Get more out of your money with PennyWise - Your personal finance tracker and budgeting
            buddy.
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
