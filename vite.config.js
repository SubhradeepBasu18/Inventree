import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public/',
  build: {
    outDir: '../dist',
  },
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
  },
});