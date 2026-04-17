import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],

  css: {
    postcss: {},
  },

  build: {
    chunkSizeWarningLimit: 1000, // remove 500kb warning

    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom"],
          routerVendor: ["react-router-dom"],
          reduxVendor: ["@reduxjs/toolkit", "react-redux"],
          alertVendor: ["sweetalert2"],
        },
      },
    },
  },
});
