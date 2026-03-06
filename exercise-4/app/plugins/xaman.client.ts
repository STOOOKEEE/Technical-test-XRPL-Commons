export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        src: 'https://xumm.app/assets/cdn/xumm.min.js',
        defer: true,
      },
    ],
  })
})
