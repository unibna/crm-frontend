import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      _apis_: path.resolve(__dirname, "src/_apis_"),
      _tests_: path.resolve(__dirname, "src/_tests_"),
      _types_: path.resolve(__dirname, "src/_types_"),
      assets: path.resolve(__dirname, "src/assets"),
      components: path.resolve(__dirname, "src/components"),
      constants: path.resolve(__dirname, "src/constants"),
      contexts: path.resolve(__dirname, "src/contexts"),
      hooks: path.resolve(__dirname, "src/hooks"),
      layouts: path.resolve(__dirname, "src/layouts"),
      locales: path.resolve(__dirname, "src/locales"),
      routes: path.resolve(__dirname, "src/routes"),
      selectors: path.resolve(__dirname, "src/selectors"),
      store: path.resolve(__dirname, "src/store"),
      theme: path.resolve(__dirname, "src/theme"),
      utils: path.resolve(__dirname, "src/utils"),
      views: path.resolve(__dirname, "src/views"),
      features: path.resolve(__dirname, "src/features"),
      services: path.resolve(__dirname, "src/services"),
    },
  },
  plugins: [react(), checker({ typescript: true })],
  build: {
    outDir: "build",
    sourcemap: "hidden"
  },
  envPrefix: "REACT_APP_",
  server: {
    port: 3000,
  },
});
