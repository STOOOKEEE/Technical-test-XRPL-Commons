export const BATCH_INTERVAL_MS = 4000
export const MAX_VISIBLE_SHAPES = 120
export const MAX_FEED_ITEMS = 50
export const SHAPE_LIFETIME_MS = 20000
export const RECONNECT_BASE_DELAY_MS = 1000
export const RECONNECT_MAX_DELAY_MS = 30000

export const TRANSACTION_COLORS: Record<string, number> = {
  Payment: 0x4488ff,
  OfferCreate: 0x44ff88,
  NFTokenMint: 0xaa44ff,
  EscrowCreate: 0xffcc44,
  default: 0x888888,
}

export const TRANSACTION_LABELS: Record<string, string> = {
  Payment: 'Payment',
  OfferCreate: 'Offer',
  NFTokenMint: 'NFT Mint',
  EscrowCreate: 'Escrow',
  default: 'Other',
}
