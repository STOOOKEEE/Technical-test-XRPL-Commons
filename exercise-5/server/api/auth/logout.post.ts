import { JWT_COOKIE_NAME } from '../../utils/constants'

export default defineEventHandler((event) => {
  deleteCookie(event, JWT_COOKIE_NAME, {
    path: '/',
  })

  return { success: true }
})
