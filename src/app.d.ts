// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string
				googleId: string
				name: string
				email: string
			} | null
		}
		// For protected pages where user is guaranteed to exist via auth hook
		interface ProtectedPageData {
			user: {
				id: string
				googleId: string
				name: string
				email: string
			}
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
