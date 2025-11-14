import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // After setting-up a backend, this can automoate the copying process of the built files:
  // build: {
  // 	outDir: '../backend/public',
  // 	emptyOutDir: true,
  // },
  // If we want to build a local version (that uses local services)
  // define: {
  // 	'process.env.VITE_LOCAL': 'true'
  // }
});
