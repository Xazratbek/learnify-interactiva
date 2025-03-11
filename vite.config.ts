import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";



export default defineConfig(({ mode }) => ({
  server: {
    host: '::', // Listen on all IPv6 addresses
    port: 8000,
    allowedHosts: [
      'rnkgk-79-127-211-218.a.free.pinggy.link', // Add your allowed host here
      'localhost', // Allow localhost for development
      '127.0.0.1', // Allow local IP for development
    ],
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
