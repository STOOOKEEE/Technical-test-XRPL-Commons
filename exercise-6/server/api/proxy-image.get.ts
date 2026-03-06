export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url parameter' })
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: 'Failed to fetch image' })
  }

  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') || 'image/jpeg'

  setResponseHeaders(event, {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400',
  })

  return Buffer.from(buffer)
})
