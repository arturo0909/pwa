import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        display: "standalone",
        display_override: ["window-controls-overlay"],
        lang: "es-ES",
        name: "CDI",
        short_name: "Activities",
        icons: [
          {
            src:"/favicon-32x32.png",
            sizes:"32x32",
            type:"image/png",
          },
          {
            src:"/android-chrome-192x192.png",
            sizes:"192x192",
            type:"image/png",
            purpose: 'any'
          },
          {
            src:"/android-chrome-512x512.png",
            sizes:"512x512",
            type:"image/png",
            purpose: 'maskable'
          }
        ]
      }
     })
  ],
})
