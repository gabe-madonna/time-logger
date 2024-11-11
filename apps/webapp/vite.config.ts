import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // root: "./apps/webapp/", // Set this to the directory containing index.html
  plugins: [react()],
});
