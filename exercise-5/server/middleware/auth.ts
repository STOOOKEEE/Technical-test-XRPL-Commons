import { verifyToken } from '../utils/auth'
import { JWT_COOKIE_NAME } from '~~/shared/constants'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const isAdminRoute = url.pathname.startsWith('/api/admin')

  if (!isAdminRoute) return

  const token = getCookie(event, JWT_COOKIE_NAME)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
    })
  }

  try {
    const payload = verifyToken(token)
    event.context.auth = payload
  }
  catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired token',
    })
  }
})
