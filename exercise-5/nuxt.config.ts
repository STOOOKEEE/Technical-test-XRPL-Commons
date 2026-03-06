export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  runtimeConfig: {
    jwtSecret: '',
    jwtExpiry: '3600',
    adminEmail: '',
    adminPassword: '',
    mongodbUri: 'mongodb://mongo:27017/exercise5',
  },
  vite: {
    server: {
      hmr: {
        port: 24678,
        clientPort: 24678,
      },
      watch: {
        usePolling: true,
      },
    },
  },
})
