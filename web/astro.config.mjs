// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Fontsource serves the Google Fonts subset of Inter, which drops ss02.
  // The local provider uses the upstream variable font so the feature works.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/fonts/InterVariable.woff2"]
          }
        ]
      },
      featureSettings: "'ss02'"
    }
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "tap"
  },
  vite: {
    server: {
      fs: {
        // Allow serving the registry CSS from the monorepo root.
        allow: [".."]
      }
    }
  }
});
