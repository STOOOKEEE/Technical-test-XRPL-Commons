import { verifyToken } from '../../utils/auth'
import { JWT_COOKIE_NAME } from '../../utils/constants'

export default defineEventHandler((event) => {
  const token = getCookie(event, JWT_COOKIE_NAME)

  if (!token) {
    return { authenticated: false }
  }

  try {
    const payload = verifyToken(token)
    return { authenticated: true, email: payload.email }
  }
  catch {
    return { authenticated: false }
  }
})
