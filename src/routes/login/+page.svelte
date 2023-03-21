<script>
  import LoginForm from "$lib/components/application/auth/mutations/LoginForm.svelte"
  import DotPattern from "$lib/components/ui/DotPattern.svelte"
</script>

<svelte:head>
  <title>Login - TVUPWEB</title>
</svelte:head>

<div class="flex min-h-full flex-col items-center justify-center bg-gray-900">
  <DotPattern />
  <main class="relative">
    <div class="flex min-h-full flex-col justify-center gap-8 px-6">
      <div class="mx-auto w-full max-w-md">
        <img class="mx-auto h-12 w-auto" src="/logo.png" alt="Expense Tracking App" />
        <h2 class="mt-2 text-center text-3xl font-bold uppercase tracking-wide text-gray-200">
          BUDGET
        </h2>
      </div>
      <div class="mx-auto w-full max-w-md rounded-lg ">
        <div class="rounded-lg shadow-lg backdrop-blur-[600px]">
          <LoginForm />
        </div>
      </div>
    </div>
  </main>
</div>
