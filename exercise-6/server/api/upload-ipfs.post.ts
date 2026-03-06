export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const pinataApiKey = config.pinataApiKey
  const pinataSecretApiKey = config.pinataSecretApiKey

  if (!pinataApiKey || !pinataSecretApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Pinata API credentials not configured' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData.find(f => f.name === 'file')
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file field' })
  }

  const blob = new Blob([file.data], { type: file.type || 'image/png' })
  const uploadForm = new FormData()
  uploadForm.append('file', blob, file.filename || 'edited-clock.png')

  try {
    const response = await $fetch<{ IpfsHash: string }>('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
      body: uploadForm,
    })

    return {
      ipfsHash: response.IpfsHash,
      ipfsUrl: `ipfs://${response.IpfsHash}`,
    }
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw createError({ statusCode: 500, statusMessage: `IPFS upload failed: ${message}` })
  }
})
