import type { IXrplTransaction, IConnectionStatus } from '~/types'
import {
  BATCH_INTERVAL_MS,
  MAX_FEED_ITEMS,
  RECONNECT_BASE_DELAY_MS,
  RECONNECT_MAX_DELAY_MS,
} from '~/utils/constants'

interface XrplTransactionEvent {
  hash: string
  tx_json: {
    TransactionType: string
    Account: string
    Amount?: string | { value: string; currency: string }
    Destination?: string
  }
}

let xrplClient: InstanceType<typeof import('xrpl').Client> | null = null
let initialized = false
let batchTimer: ReturnType<typeof setInterval> | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null
const queue: IXrplTransaction[] = []

const currentBatch = ref<IXrplTransaction[]>([])
const recentTransactions = ref<IXrplTransaction[]>([])
const connectionStatus = ref<IConnectionStatus>({
  connected: false,
  reconnecting: false,
  retryCount: 0,
  error: null,
})

function parseAmount(amount: string | { value: string; currency: string } | undefined): string | undefined {
  if (!amount) return undefined
  if (typeof amount === 'string') {
    return `${(Number(amount) / 1_000_000).toFixed(2)} XRP`
  }
  return `${amount.value} ${amount.currency}`
}

function handleTransaction(event: XrplTransactionEvent): void {
  const tx = event.tx_json
  if (!tx) return
  const parsed: IXrplTransaction = {
    hash: event.hash,
    type: tx.TransactionType,
    account: tx.Account,
    amount: parseAmount(tx.Amount),
    destination: tx.Destination,
    timestamp: Date.now(),
  }
  queue.push(parsed)
}

function processBatch(): void {
  if (queue.length === 0) return
  const batch = queue.splice(0)
  currentBatch.value = batch
  recentTransactions.value = [...batch, ...recentTransactions.value].slice(0, MAX_FEED_ITEMS)
}

async function connect(): Promise<void> {
  const { Client } = await import('xrpl')
  const config = useRuntimeConfig()
  const wsUrl = config.public.xrplWsUrl as string

  xrplClient = new Client(wsUrl)

  xrplClient.on('connected', () => {
    connectionStatus.value = {
      connected: true,
      reconnecting: false,
      retryCount: 0,
      error: null,
    }
  })

  xrplClient.on('disconnected', (code: number) => {
    connectionStatus.value = {
      ...connectionStatus.value,
      connected: false,
      error: `Disconnected (code: ${code})`,
    }
    scheduleReconnect()
  })

  xrplClient.on('transaction', (event: XrplTransactionEvent) => {
    handleTransaction(event)
  })

  await xrplClient.connect()

  await xrplClient.request({
    command: 'subscribe',
    streams: ['transactions'],
  })
}

function scheduleReconnect(): void {
  if (retryTimer) return
  connectionStatus.value.reconnecting = true
  const delay = Math.min(
    RECONNECT_BASE_DELAY_MS * Math.pow(2, connectionStatus.value.retryCount),
    RECONNECT_MAX_DELAY_MS,
  )
  retryTimer = setTimeout(async () => {
    retryTimer = null
    connectionStatus.value.retryCount++
    try {
      await connect()
    }
    catch {
      scheduleReconnect()
    }
  }, delay)
}

async function initialize(): Promise<void> {
  if (initialized || !import.meta.client) return
  initialized = true

  batchTimer = setInterval(processBatch, BATCH_INTERVAL_MS)

  try {
    await connect()
  }
  catch (err) {
    connectionStatus.value.error = err instanceof Error ? err.message : 'Connection failed'
    scheduleReconnect()
  }
}

async function disconnect(): Promise<void> {
  if (batchTimer) {
    clearInterval(batchTimer)
    batchTimer = null
  }
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
  if (xrplClient?.isConnected()) {
    try {
      await xrplClient.request({
        command: 'unsubscribe',
        streams: ['transactions'],
      })
    }
    catch { /* ignore unsubscribe errors on disconnect */ }
    await xrplClient.disconnect()
  }
  xrplClient = null
  initialized = false
}

async function retry(): Promise<void> {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }
  connectionStatus.value = {
    connected: false,
    reconnecting: false,
    retryCount: 0,
    error: null,
  }
  try {
    await connect()
  }
  catch (err) {
    connectionStatus.value.error = err instanceof Error ? err.message : 'Connection failed'
    scheduleReconnect()
  }
}

export function useXrplStream() {
  return {
    currentBatch: readonly(currentBatch),
    recentTransactions: readonly(recentTransactions),
    connectionStatus: readonly(connectionStatus),
    initialize,
    disconnect,
    retry,
  }
}
