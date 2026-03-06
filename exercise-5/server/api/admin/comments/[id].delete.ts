import { ObjectId } from 'mongodb'
import { getCommentsCollection } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !ObjectId.isValid(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid comment ID',
    })
  }

  const collection = await getCommentsCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      message: 'Comment not found',
    })
  }

  return { success: true }
})
