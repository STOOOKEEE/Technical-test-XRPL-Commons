const ALLOWED_HOST = 'd2pn8kiwq2w21t.cloudfront.net'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing url parameter' })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  }
  catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    throw createError({ statusCode: 403, statusMessage: 'URL host not allowed' })
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
