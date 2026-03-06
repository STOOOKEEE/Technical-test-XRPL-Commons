import { JWT_COOKIE_NAME } from '~~/shared/constants'

export default defineEventHandler((event) => {
  deleteCookie(event, JWT_COOKIE_NAME, {
    path: '/',
  })

  return { success: true }
})
