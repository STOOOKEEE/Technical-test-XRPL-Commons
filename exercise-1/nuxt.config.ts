// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@unocss/nuxt'],
  runtimeConfig: {
    xrplWalletSeed: '',
    xrplNetwork: 'wss://s.altnet.rippletest.net:51233',
  },
})
