import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// https://astro.build/config
export default defineConfig({
  // Static Site Generation for maximum speed
  output: "static",

  // Build optimizations
  build: {
    inlineStylesheets: "auto",
  },

  // Prefetch links for instant navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Compress output
  compressHTML: true,

  // Image optimization
  image: {
    domains: ["images.unsplash.com", "plus.unsplash.com"],
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ],
    },
    build: {
      // Minify for production with esbuild (faster)
      minify: 'esbuild',
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            gsap: ["gsap"],
          },
        },
      },
    },
  },
});
