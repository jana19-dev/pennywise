export const load = async ({ url }: { url: URL }) => {
	const error = url.searchParams.get("error")

	return {
		error,
	}
}
