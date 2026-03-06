export default defineNuxtPlugin(async () => {
  const { initialize } = useXrplStream()
  await initialize()
})
