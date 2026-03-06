export interface IXrplTransaction {
  hash: string
  type: string
  account: string
  amount?: string
  destination?: string
  timestamp: number
}

export interface ITransactionBatch {
  transactions: IXrplTransaction[]
  batchTimestamp: number
}

export interface IConnectionStatus {
  connected: boolean
  reconnecting: boolean
  retryCount: number
  error: string | null
}

export interface ITransactionVisual {
  id: string
  type: string
  account: string
  amount?: string
  destination?: string
  meshIndex: number
}
