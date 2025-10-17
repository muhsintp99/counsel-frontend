import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = `${env.PORT}`;

  return {
    server: {
      open: true,
      port: PORT,
      host: true,

      // 👇 add this line to allow your domain
      allowedHosts: ['admin.edspiriainternational.com', 'localhost'],

      proxy: {
        '/public': {
          target: 'https://api.edspiriainternational.com',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/countries': {
          target: 'https://api.edspiriainternational.com',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },

    preview: {
      open: true,
      host: true,
      allowedHosts: ['admin.edspiriainternational.com', 'localhost'],
    },

    define: {
      global: 'window',
    },

    resolve: {
      alias: [],
    },

    base: API_URL,
    plugins: [react(), jsconfigPaths()],
  };
});
