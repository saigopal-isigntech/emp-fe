import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const htmlBypass = (req: any) => {
  if (req.headers && req.headers.accept && req.headers.accept.includes("text/html")) {
    return "/index.html";
  }
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
      "/employees": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
      "/departments": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
      "/attendance": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
      "/leaves": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
      "/dashboard": {
        target: "http://localhost:8080",
        changeOrigin: true,
        bypass: htmlBypass,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Warn only above 600 kB (our gzipped output is only 174 kB - well within budget)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendors into separate cacheable chunks
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/react-router-dom") || id.includes("node_modules/react-router/")) {
            return "vendor-router";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }
          if (id.includes("node_modules/axios")) {
            return "vendor-axios";
          }
          if (id.includes("node_modules/react-icons")) {
            return "vendor-icons";
          }
        },
      },
    },
  },
});
