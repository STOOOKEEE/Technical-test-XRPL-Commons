import { getCommentsCollection } from '../../utils/db'
import { MAX_AUTHOR_LENGTH, MAX_CONTENT_LENGTH } from '../../utils/constants'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.author || !body?.content) {
    throw createError({
      statusCode: 400,
      message: 'Author and content are required',
    })
  }

  if (body.author.length > MAX_AUTHOR_LENGTH) {
    throw createError({
      statusCode: 400,
      message: `Author must be ${MAX_AUTHOR_LENGTH} characters or less`,
    })
  }

  if (body.content.length > MAX_CONTENT_LENGTH) {
    throw createError({
      statusCode: 400,
      message: `Content must be ${MAX_CONTENT_LENGTH} characters or less`,
    })
  }

  const now = new Date().toISOString()
  const collection = await getCommentsCollection()

  const result = await collection.insertOne({
    author: body.author.trim(),
    content: body.content.trim(),
    createdAt: now,
    updatedAt: now,
  })

  return {
    _id: result.insertedId.toString(),
    author: body.author.trim(),
    content: body.content.trim(),
    createdAt: now,
    updatedAt: now,
  }
})
