import { Client, Wallet } from 'xrpl'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { imageUrl } = body

  if (!imageUrl || typeof imageUrl !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing imageUrl' })
  }

  const config = useRuntimeConfig()
  const seed = config.xrplWalletSeed
  const network = config.xrplNetwork

  if (!seed) {
    throw createError({ statusCode: 500, statusMessage: 'XRPL wallet seed not configured' })
  }

  const client = new Client(network)

  try {
    await client.connect()

    const wallet = Wallet.fromSeed(seed)
    const uri = Buffer.from(imageUrl, 'utf8').toString('hex').toUpperCase()

    const transaction = {
      TransactionType: 'NFTokenMint' as const,
      Account: wallet.classicAddress,
      URI: uri,
      Flags: 8,
      NFTokenTaxon: 0,
      TransferFee: 0,
    }

    const response = await client.submitAndWait(transaction, { wallet })
    const txHash = response.result.hash

    return { txHash }
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({ statusCode: 500, statusMessage: `Mint failed: ${message}` })
  }
  finally {
    await client.disconnect()
  }
})
