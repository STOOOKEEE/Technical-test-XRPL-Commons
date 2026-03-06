<script setup lang="ts">
import { TRANSACTION_LABELS } from '~/utils/constants'

const { recentTransactions } = useXrplStream()

function truncateHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-6)}`
}

function getLabel(type: string): string {
  return TRANSACTION_LABELS[type] ?? TRANSACTION_LABELS.default
}

function getColorClass(type: string): string {
  switch (type) {
    case 'Payment': return 'text-#4488ff'
    case 'OfferCreate': return 'text-#44ff88'
    case 'NFTokenMint': return 'text-#aa44ff'
    case 'EscrowCreate': return 'text-#ffcc44'
    default: return 'text-#888'
  }
}
</script>

<template>
  <div class="bg-#111 border border-#222 p-6">
    <h2 class="text-lg font-semibold mb-4">Recent Transactions</h2>
    <div v-if="recentTransactions.length === 0" class="text-sm text-#888">
      Waiting for transactions...
    </div>
    <div v-else class="max-h-64 overflow-y-auto space-y-2">
      <div
        v-for="tx in recentTransactions"
        :key="tx.hash"
        class="flex items-center justify-between gap-4 py-2 border-b border-#222 last:border-0"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-xs font-semibold w-16 shrink-0" :class="getColorClass(tx.type)">
            {{ getLabel(tx.type) }}
          </span>
          <span class="font-mono text-xs text-#888 truncate">
            {{ truncateAddress(tx.account) }}
          </span>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span v-if="tx.amount" class="text-xs text-white">
            {{ tx.amount }}
          </span>
          <a
            :href="`https://livenet.xrpl.org/transactions/${tx.hash}`"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-xs text-#888 hover:text-white transition-colors duration-150"
          >
            {{ truncateHash(tx.hash) }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
