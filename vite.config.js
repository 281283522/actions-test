import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ react() ],
  // build: {
  //   publicPath: '/hello-world/'
  //   // assetsDir: 'hello-world/assets'
  // }
});
