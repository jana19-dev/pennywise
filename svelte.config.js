import { vitePreprocess } from "@sveltejs/kit/vite"
import adapter from "@sveltejs/adapter-node"

const config = {
  kit: {
    adapter: adapter()
  },

  preprocess: [vitePreprocess()]
}

export default config
