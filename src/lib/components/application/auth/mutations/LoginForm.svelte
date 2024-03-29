<script>
  import { page } from "$app/stores"

  import { Button } from "$lib/components/ui"

  import { createMutation } from "@tanstack/svelte-query"
  import { LOGIN } from "$lib/graphql/client/auth/mutations"

  import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
  import { auth, provider } from "$lib/utils/firebase"

  import { ErrorAlert } from "$lib/components/ui"

  let googleLoginError = null
  let isRedirecting = false
  const onLogin = () => {
    isRedirecting = true
    googleLoginError = null
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const accessToken = credential.idToken
        $loginMutation.mutate({ accessToken })
      })
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message
        googleLoginError = errorMessage
        isRedirecting = false
      })
  }

  const loginMutation = createMutation(LOGIN, {
    onSuccess: () => {
      isRedirecting = true
      const referrer = $page.url.searchParams.get(`referrer`)
      const href = referrer ? referrer : `/`
      window.location.href = href
    }
  })
</script>

<div class="flex flex-col flex-wrap items-center gap-4 rounded-lg p-2">
  {#if isRedirecting}
    <p class="-mb-2 -mt-2 text-left text-sm text-gray-200">Taking you to your dashboard...</p>
  {/if}
  <Button
    on:click={onLogin}
    variant="ghost"
    isDisabled={$loginMutation.isLoading || isRedirecting}
    class="!hover:bg-[#4285F4]/90 !focus:ring-[#4285F4]/50 mb-2 mr-2 inline-flex w-fit items-center rounded-lg !bg-[#4285F4] px-5 py-2.5 text-center text-sm font-medium !text-white  focus:outline-none focus:ring-4"
  >
    <svg
      class="-ml-1 mr-3 h-7 w-7"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
    >
      <path
        fill="currentColor"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
    Sign in with Google
  </Button>
  {#if $loginMutation.isError || googleLoginError}
    <ErrorAlert>
      {$loginMutation.error?.message || googleLoginError}
    </ErrorAlert>
  {/if}
</div>
