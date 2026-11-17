import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // The hosted preview proxies the dev server under a sandbox subdomain.
    allowedHosts: [".e2b.app", ".arena.ai", "localhost"],
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [".e2b.app", ".arena.ai", "localhost"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
