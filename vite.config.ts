import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";

declare const process: {
  env: {
    VITE_BASE_PATH?: string;
  };
};

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  define: {
    __APP_NAME__: JSON.stringify("Timeline Studio"),
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [react()],
});
