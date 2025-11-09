// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// export default defineConfig({
//   plugins: [react()],
//   server: { port: 5173 },
//   build: { outDir: "dist" }
// });

export default {
  build: {
    lib: {
      entry: './src/widget.js', // your entry point for embed script
      name: 'LoanChatWidget',
      fileName: 'widget',
      formats: ['iife']
    },
    rollupOptions: {
      external: [], // no external dependencies
    },
  },
};
