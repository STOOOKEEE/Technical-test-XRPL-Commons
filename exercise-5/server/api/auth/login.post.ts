import { getDb } from '../../utils/db'
import { comparePassword, signToken } from '../../utils/auth'
import { JWT_COOKIE_NAME, JWT_EXPIRY_SECONDS } from '../../utils/constants'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required',
    })
  }

  const db = await getDb()
  const admin = await db.collection('admins').findOne({ email: body.email })

  if (!admin) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  const valid = await comparePassword(body.password, admin.password)
  if (!valid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  const token = signToken(admin.email)

  setCookie(event, JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: JWT_EXPIRY_SECONDS,
    path: '/',
  })

  return { success: true }
})
