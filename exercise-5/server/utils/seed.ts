import { getDb } from './db'
import { hashPassword } from './auth'

let seeded = false

export async function seedAdmin() {
  if (seeded) return
  seeded = true

  const config = useRuntimeConfig()
  const db = await getDb()
  const admins = db.collection('admins')

  const existing = await admins.findOne({ email: config.adminEmail })
  if (existing) return

  const hashedPassword = await hashPassword(config.adminPassword)
  await admins.insertOne({
    email: config.adminEmail,
    password: hashedPassword,
  })
}
