import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		files: {
			hooks: {
				client: 'src/lib/hooks/hooks.client.ts',
				server: 'src/lib/hooks/hooks.server.ts'
			}
		}
	}
}

export default config
