// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// export default defineConfig({
//   plugins: [react()],
//   server: { port: 5173 },
//   build: { outDir: "dist" }
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/widget.js", // ✅ path we just created
      name: "LoanChatWidget",
      fileName: "widget",
      formats: ["iife"], // browser-friendly script
    },
  },
});
