import { getCommentsCollection } from '../../utils/db'

export default defineEventHandler(async () => {
  const collection = await getCommentsCollection()
  const comments = await collection
    .find()
    .sort({ createdAt: -1 })
    .toArray()

  return comments.map((c) => ({
    _id: c._id.toString(),
    author: c.author,
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }))
})
