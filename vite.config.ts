import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// A single self-contained index.html (everything inlined) is occasionally handy,
// but it must never be the default: it base64-encodes every image and stylesheet
// into the HTML, so nothing is lazy-loaded or cached separately and the whole
// page must download before first paint. Use `npm run build:single` for that.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "singlefile" ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Photos dominate the payload; emit them as separate hashed files and keep
    // Vite from inlining them as data URIs.
    assetsInlineLimit: 2048,
  },
  server: {
    host: true,
    // Previews and tunneled hosts (e.g. *.e2b.app) are not in Vite's default
    // allowlist and would otherwise fail with a 403.
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
}));
