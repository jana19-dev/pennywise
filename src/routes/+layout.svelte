<script>
  import "../app.postcss"

  import { SvelteToast } from "@zerodevx/svelte-toast"

  import { navigating } from "$app/stores"
  import LoadingPage from "$lib/components/ui/LoadingPage.svelte"

  import { browser } from "$app/environment"
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: !!browser,
        retry: false,
        refetchOnWindowFocus: false
      }
    }
  })
</script>

{#if $navigating}
  <LoadingPage />
{/if}

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>

{#if browser}
  <SvelteToast />
{/if}

<style>
  :root {
    --toastContainerTop: 0.5rem;
    --toastContainerRight: auto;
    --toastContainerBottom: auto;
    --toastContainerLeft: calc(50vw - 8rem);
    --toastPadding: 0;
    --toastMsgPadding: 0;
    --toastBackground: none;
  }
</style>
