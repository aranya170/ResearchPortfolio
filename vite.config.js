import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Keep the CRA-style prefix so existing CI/Render env vars keep working
  envPrefix: "REACT_APP_",
  server: { port: 3000 },
  preview: { port: 3000 },
  build: { outDir: "build" },
});
