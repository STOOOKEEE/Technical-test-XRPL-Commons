import { seedAdmin } from '../utils/seed'

export default defineNitroPlugin(async () => {
  await seedAdmin()
})
