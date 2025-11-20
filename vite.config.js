import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    // PWA aman tanpa glob
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Assistenku Core",
        short_name: "Assistenku",
        description: "Sistem pusat Assistenku",
        theme_color: "#4da6ff",
        background_color: "#ffffff",
        display: "standalone",
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

  // Fix path untuk Vercel
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  // Pastikan SPA React berjalan di semua route
  server: {
    historyApiFallback: true,
  },
});
