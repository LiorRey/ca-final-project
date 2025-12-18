import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configure Vite to build directly to backend public directory
  build: {
    outDir: "../backend/public",
    emptyOutDir: false, // Don't empty entire directory, only overwrite build artifacts
  },
  // If we want to build a local version (that uses local services)
  // define: {
  // 	'process.env.VITE_LOCAL': 'true'
  // }
});
