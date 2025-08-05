import type { HandleClientError } from "@sveltejs/kit"

// Client-side error handling
export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	// Log client-side errors (e.g., to analytics service)
	console.error("Client error:", { error, event, status, message })

	// Could send to error tracking service like Sentry
	// Sentry.captureException(error, { extra: { event, status } })

	return {
		message: "Something went wrong! Please try refreshing the page.",
	}
}

// Client-side initialization (if needed)
// export const init = async () => {
//   // Initialize client-side services
//   // await initializeAnalytics()
// }
