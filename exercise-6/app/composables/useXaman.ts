import type { IPaymentResult } from '~/types'
import { XRPL_EXPLORER_BASE_URL } from '~/utils/constants'

declare global {
  interface Window {
    Xumm: new (apiKey: string) => XummSdk
  }
}

interface XummSdk {
  authorize: () => Promise<void>
  logout: () => void
  user: {
    account: Promise<string | undefined>
  }
  payload: {
    create: (payload: Record<string, unknown>) => Promise<XummCreated>
    get: (uuid: string) => Promise<XummPayload>
    createAndSubscribe: (
      payload: Record<string, unknown>,
      callback: (event: XummEvent) => XummEvent | undefined
    ) => Promise<{ created: XummCreated; resolved: Promise<unknown> }>
  }
}

interface XummEvent {
  data: Record<string, unknown>
}

interface XummCreated {
  uuid: string
  next: { always: string }
  refs: { qr_png: string }
}

interface XummPayload {
  meta: { resolved: boolean; signed: boolean }
  response: { txid: string; dispatched_result: string }
}

let xummSingleton: XummSdk | null = null

const walletAddress = ref<string | null>(null)
const isConnecting = ref(false)
const isMinting = ref(false)
const error = ref<string | null>(null)
const mintResult = ref<IPaymentResult | null>(null)
const qrUrl = ref<string | null>(null)

function stringToHex(str: string): string {
  return Array.from(new TextEncoder().encode(str))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

export function useXaman() {
  const config = useRuntimeConfig()

  function initSdk(): XummSdk {
    if (!xummSingleton) {
      if (typeof window === 'undefined' || !window.Xumm) {
        throw new Error('Xaman SDK not loaded')
      }
      xummSingleton = new window.Xumm(config.public.xamanApiKey)
    }
    return xummSingleton
  }

  async function connect() {
    isConnecting.value = true
    error.value = null

    try {
      if (!xummSingleton) {
        if (typeof window === 'undefined' || !window.Xumm) {
          throw new Error('Xaman SDK not loaded')
        }
        xummSingleton = new window.Xumm(config.public.xamanApiKey)
      }

      const sdk = xummSingleton

      const existingAccount = await Promise.race([
        sdk.user.account,
        new Promise<undefined>(resolve => setTimeout(() => resolve(undefined), 2000)),
      ])
      if (existingAccount) {
        walletAddress.value = existingAccount
        return
      }

      await sdk.authorize()
      const account = await sdk.user.account
      if (account) {
        walletAddress.value = account
      }
      else {
        throw new Error('No account returned from Xaman')
      }
    }
    catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to connect wallet'
    }
    finally {
      isConnecting.value = false
    }
  }

  async function mintNftWithXaman(ipfsUri: string) {
    isMinting.value = true
    error.value = null
    mintResult.value = null

    try {
      const sdk = initSdk()
      const uri = stringToHex(ipfsUri)

      const { created, resolved } = await sdk.payload.createAndSubscribe({
        TransactionType: 'NFTokenMint',
        NFTokenTaxon: 0,
        Flags: 8,
        TransferFee: 0,
        URI: uri,
      }, (eventMessage: XummEvent) => {
        if (eventMessage.data && typeof eventMessage.data.signed === 'boolean') {
          return eventMessage
        }
        return undefined
      })

      if (created.refs?.qr_png) {
        qrUrl.value = created.refs.qr_png
      }

      await resolved

      const fullPayload = await sdk.payload.get(created.uuid)

      if (!fullPayload.meta.signed) {
        throw new Error('Transaction was rejected by user')
      }

      const txHash = fullPayload.response?.txid
      if (!txHash) {
        throw new Error('Transaction signed but no hash received')
      }

      mintResult.value = {
        txHash,
        explorerUrl: `${XRPL_EXPLORER_BASE_URL}/${txHash}`,
      }
    }
    catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Minting failed'
    }
    finally {
      isMinting.value = false
      qrUrl.value = null
    }
  }

  function disconnect() {
    if (xummSingleton) {
      xummSingleton.logout()
    }
    xummSingleton = null
    walletAddress.value = null
    mintResult.value = null
    error.value = null
    qrUrl.value = null
  }

  function resetMint() {
    mintResult.value = null
    error.value = null
  }

  return {
    walletAddress,
    isConnecting,
    isMinting,
    error,
    mintResult,
    qrUrl,
    connect,
    mintNftWithXaman,
    disconnect,
    resetMint,
  }
}
