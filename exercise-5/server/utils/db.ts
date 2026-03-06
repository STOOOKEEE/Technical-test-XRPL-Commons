import { MongoClient, type Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (db) return db

  const config = useRuntimeConfig()
  const uri = config.mongodbUri

  client = new MongoClient(uri)
  await client.connect()
  db = client.db()

  return db
}

export async function getCommentsCollection() {
  const database = await getDb()
  return database.collection('comments')
}
