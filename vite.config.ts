import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// BJuris — configuração Vite
// Stack obrigatória: Vite + React + TypeScript (sem Next.js)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "BJuris — Escritório Jurídico Digital",
        short_name: "BJuris",
        description:
          "Plataforma jurídica para acompanhamento completo de clientes e processos previdenciários.",
        theme_color: "#0B0B0C",
        background_color: "#0B0B0C",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "favicon.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" }
        ]
      },
      workbox: {
        // Cache estratégico: shell da aplicação + assets estáticos.
        // Dados sensíveis de clientes NUNCA são cacheados aqui (seção 3 e 39 do briefing).
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Chamadas à API do Supabase: nunca servir do cache, apenas rede.
            // Autenticação e dados jurídicos exigem sempre a origem.
            urlPattern: ({ url }) => url.hostname.endsWith(".supabase.co"),
            handler: "NetworkOnly"
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "bjuris-images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    sourcemap: false,
    outDir: "dist",
    emptyOutDir: true
  }
});
