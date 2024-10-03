import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  define: {
    "import.meta.env.VITE_API_KEY": JSON.stringify(process.env.VITE_API_KEY),
  },
});
