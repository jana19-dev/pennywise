<script>
  import LoadingSpinnerIcon from "@codepiercer/svelte-tailwind/icons/LoadingSpinnerIcon.svelte"
</script>

<div
  class="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gray-900/50 backdrop-blur-sm"
>
  <div class="flex w-full flex-col items-center gap-3 text-white lg:ml-28">
    <LoadingSpinnerIcon class="h-16 w-16 text-white" />
    <h2 class="text-xl font-semibold ">Loading...</h2>
    <p class="">This may take a few seconds.</p>
  </div>
</div>
