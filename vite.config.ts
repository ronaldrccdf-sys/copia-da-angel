import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    /**
     * 🔴 ESSENCIAL PARA GITHUB PAGES
     * Se o repo for: https://github.com/usuario/ronaldrccdf-sys
     */
    base: "/ronaldrccdf-sys/",

    server: {
      port: 3000,
      host: "0.0.0.0",
    },

    plugins: [react()],

    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    /**
     * 🔧 BUILD PARA PRODUÇÃO
     */
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
      emptyOutDir: true,
    },
  };
});
