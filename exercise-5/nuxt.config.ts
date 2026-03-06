export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET ?? '',
    jwtExpiry: process.env.JWT_EXPIRY ?? '3600',
    adminEmail: process.env.ADMIN_EMAIL ?? '',
    adminPassword: process.env.ADMIN_PASSWORD ?? '',
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://mongo:27017/exercise5',
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
