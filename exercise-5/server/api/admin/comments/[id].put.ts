import { ObjectId } from 'mongodb'
import { getCommentsCollection } from '../../../utils/db'
import { MAX_CONTENT_LENGTH } from '~~/shared/constants'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !ObjectId.isValid(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid comment ID',
    })
  }

  const body = await readBody(event)

  if (!body?.content) {
    throw createError({
      statusCode: 400,
      message: 'Content is required',
    })
  }

  if (body.content.length > MAX_CONTENT_LENGTH) {
    throw createError({
      statusCode: 400,
      message: `Content must be ${MAX_CONTENT_LENGTH} characters or less`,
    })
  }

  const collection = await getCommentsCollection()
  const now = new Date().toISOString()

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { content: body.content.trim(), updatedAt: now } },
    { returnDocument: 'after' },
  )

  if (!result) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  return {
    _id: result._id.toString(),
    author: result.author,
    content: result.content,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }
})
