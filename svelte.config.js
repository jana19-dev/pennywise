import { vitePreprocess } from "@sveltejs/kit/vite"
import adapter from "@sveltejs/adapter-auto"

const config = {
  kit: {
    adapter: adapter()
  },

  preprocess: [vitePreprocess()]
}

export default config
