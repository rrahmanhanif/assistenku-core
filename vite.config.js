import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "generateSW",

      // Disable auto glob scanning to remove warnings on Vercel
      workbox: {
        globPatterns: [],
      },

      manifest: {
        name: "Assistenku Core",
        short_name: "Assistenku",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#a8d8ff",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
