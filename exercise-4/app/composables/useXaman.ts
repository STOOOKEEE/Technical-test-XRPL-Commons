import type { IPaymentResult, IXummSdk } from '~/types'
import { XRPL_EXPLORER_BASE_URL, DROPS_PER_XRP, SESSION_CHECK_TIMEOUT_MS } from '~/utils/constants'

declare global {
  interface Window {
    Xumm: new (apiKey: string) => IXummSdk
  }
}

// Global state — persists across page navigations
let xummSingleton: IXummSdk | null = null

const walletAddress = ref<string | null>(null)
const isConnecting = ref(false)
const isSending = ref(false)
const error = ref<string | null>(null)
const paymentResult = ref<IPaymentResult | null>(null)
const qrUrl = ref<string | null>(null)

export function useXaman() {
  const config = useRuntimeConfig()

  function initSdk(): IXummSdk {
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
      const sdk = initSdk()

      // Check for existing session (with timeout to avoid hanging)
      const existingAccount = await Promise.race([
        sdk.user.account,
        new Promise<undefined>(resolve => setTimeout(() => resolve(undefined), SESSION_CHECK_TIMEOUT_MS)),
      ])
      if (existingAccount) {
        walletAddress.value = existingAccount
        return
      }

      // No existing session — trigger auth flow
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

  async function sendPayment(destination: string, amountXrp: string) {
    isSending.value = true
    error.value = null
    paymentResult.value = null

    try {
      const sdk = initSdk()
      const amountDrops = String(Math.floor(Number(amountXrp) * DROPS_PER_XRP))

      const { created, resolved } = await sdk.payload.createAndSubscribe({
        TransactionType: 'Payment',
        Destination: destination,
        Amount: amountDrops,
      }, (eventMessage) => {
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

      paymentResult.value = {
        txHash,
        explorerUrl: `${XRPL_EXPLORER_BASE_URL}/${txHash}`,
      }
    }
    catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Payment failed'
    }
    finally {
      isSending.value = false
      qrUrl.value = null
    }
  }

  function disconnect() {
    if (xummSingleton) {
      xummSingleton.logout()
    }
    xummSingleton = null
    walletAddress.value = null
    paymentResult.value = null
    error.value = null
    qrUrl.value = null
  }

  return {
    walletAddress,
    isConnecting,
    isSending,
    error,
    paymentResult,
    qrUrl,
    connect,
    sendPayment,
    disconnect,
  }
}
