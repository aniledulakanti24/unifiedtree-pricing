import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production builds are served from https://<user>.github.io/unifiedtree-pricing/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/unifiedtree-pricing/' : '/',
}));
