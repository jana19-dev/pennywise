<script>
  import { page } from "$app/stores"

  import { Button } from "@codepiercer/svelte-tailwind"
</script>

<div class="flex h-screen w-full max-w-none flex-col items-center justify-center gap-6">
  <img class="h-16 w-16" src="/logo.png" alt="Budget" />
  <h1>Welcome to Budget</h1>
  <img
    class="inline-block h-24 w-24 rounded-full"
    src={$page.data.session.user.image}
    alt={$page.data.session.user.name}
  />
  <p>Logged in as <strong>{$page.data.session.user.name}</strong></p>

  <Button href="/logout" variant="outlined" color="red" data-sveltekit-preload-data="tap"
    >Logout</Button
  >
</div>
