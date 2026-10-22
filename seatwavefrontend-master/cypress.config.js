import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    experimentalSessionAndOrigin: true,
    env: {
      apiUrl: 'http://localhost:8080',
    }
  },
});