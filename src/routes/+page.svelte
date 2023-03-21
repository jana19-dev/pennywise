<script>
  import { Button, Dialog } from "@codepiercer/svelte-tailwind"

  import { signInWithPopup } from "firebase/auth"

  import { auth, provider } from "$lib/utils/firebase"

  let user

  const onLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        user = result.user
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.log({ errorCode, errorMessage })
      })
  }

  let dialog
</script>

<div class="flex h-screen w-full max-w-none flex-col items-center justify-center gap-2">
  <h1>Welcome to Budget</h1>
  {#if user}
    <p>Logged in as <strong>{user.displayName}</strong>. Woo hoo!</p>
    <img
      src="https://media.giphy.com/media/lgcUUCXgC8mEo/giphy.gif"
      alt="rick roll"
      class="mx-auto"
    />
  {:else}
    <p>Click the button below to login with Google</p>
    <Button on:click={onLogin}>Login with Google</Button>
  {/if}
</div>

<Dialog bind:dialog closeOnOverlayClick>
  <div slot="content">
    <img
      src="https://media.giphy.com/media/lgcUUCXgC8mEo/giphy.gif"
      alt="rick roll"
      class="mx-auto"
    />
  </div>
</Dialog>
