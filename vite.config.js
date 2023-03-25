import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import { SvelteKitPWA } from "@vite-pwa/sveltekit"

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      srcDir: `./src`,
      scope: `/`,
      base: `/`,
      manifest: {
        name: `PennyWise`,
        short_name: `PennyWise`,
        description: `Expense tracker and budgeting app`,
        start_url: `/`,
        scope: `/`,
        display: `standalone`,
        theme_color: `#4F46E5`,
        background_color: `#4F46E5`,
        icons: [
          {
            src: `/logo.png`,
            sizes: `192x192`,
            type: `image/png`
          },
          {
            src: `/logo.png`,
            sizes: `512x512`,
            type: `image/png`
          },
          {
            src: `/logo.png`,
            sizes: `512x512`,
            type: `image/png`,
            purpose: `any maskable`
          }
        ]
      },
      injectManifest: {
        globPatterns: [`client/**/*.{js,css,ico,png,svg,webp,woff,woff2}`]
      },
      workbox: {
        globPatterns: [`client/**/*.{js,css,ico,png,svg,webp,woff,woff2}`]
      }
    })
  ],
  define: {
    "import.meta.env.BUILD_TIME": JSON.stringify(new Date().toISOString()),
    "import.meta.env.BUILD_VERSION": JSON.stringify(process.env.npm_package_version)
  },
  server: {
    port: process.env.PORT
  }
})
