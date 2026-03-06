<script setup lang="ts">
import { isValidXrplAddress, isValidXrpAmount } from '~/utils/validation'

const {
  walletAddress,
  isConnecting,
  isSending,
  error,
  paymentResult,
  qrUrl,
  connect,
  sendPayment,
  disconnect,
} = useXaman()

const destination = ref('')
const amount = ref('')

const destinationError = computed(() => {
  if (!destination.value) return null
  return isValidXrplAddress(destination.value) ? null : 'Invalid XRPL address format'
})

const amountError = computed(() => {
  if (!amount.value) return null
  return isValidXrpAmount(amount.value) ? null : 'Amount must be a positive number'
})

const canSend = computed(() => {
  return walletAddress.value
    && destination.value
    && amount.value
    && !destinationError.value
    && !amountError.value
    && !isSending.value
})

async function handleSend() {
  if (!canSend.value) return
  await sendPayment(destination.value, amount.value)
}

function resetForm() {
  destination.value = ''
  amount.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <NuxtLink to="/" class="text-sm text-#888 hover:text-white transition-colors duration-150">
        &larr; Back to home
      </NuxtLink>
    </div>

    <h1 class="text-4xl font-bold tracking-tight">
      Wallet
    </h1>

    <!-- Not connected -->
    <div v-if="!walletAddress" class="flex flex-col gap-4">
      <button
        :disabled="isConnecting"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        @click="connect"
      >
        <span v-if="isConnecting">Connecting...</span>
        <span v-else>Connect with Xaman</span>
      </button>
    </div>

    <!-- Connected -->
    <div v-else class="flex flex-col gap-8">
      <div class="bg-#111 border border-#222 p-6">
        <p class="text-sm text-#888 mb-1">Connected Wallet</p>
        <code class="font-mono text-sm text-white break-all">{{ walletAddress }}</code>
        <button
          class="block mt-4 text-sm text-#888 hover:text-white transition-colors duration-150"
          @click="disconnect"
        >
          Disconnect
        </button>
      </div>

      <!-- Payment form -->
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">Send XRP</h2>

        <div>
          <label class="block text-sm text-#888 mb-2">Recipient Address</label>
          <input
            v-model="destination"
            type="text"
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888 font-mono text-sm"
            :class="{ 'border-#FF3333': destinationError }"
          >
          <p v-if="destinationError" class="text-#FF3333 text-sm mt-1">{{ destinationError }}</p>
        </div>

        <div>
          <label class="block text-sm text-#888 mb-2">Amount (XRP)</label>
          <input
            v-model="amount"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
            class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888"
            :class="{ 'border-#FF3333': amountError }"
          >
          <p v-if="amountError" class="text-#FF3333 text-sm mt-1">{{ amountError }}</p>
        </div>

        <button
          :disabled="!canSend"
          class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
          @click="handleSend"
        >
          <span v-if="isSending">Sending...</span>
          <span v-else>Send XRP</span>
        </button>
      </div>

      <!-- QR Code for signing -->
      <div v-if="qrUrl" class="bg-#111 border border-#222 p-6 flex flex-col items-center gap-4">
        <p class="text-sm text-#888">Scan with Xaman to sign the transaction</p>
        <img :src="qrUrl" alt="Xaman QR Code" class="w-48 h-48">
      </div>

      <!-- Payment result -->
      <div v-if="paymentResult" class="bg-#111 border border-#222 p-6 flex flex-col gap-4">
        <p class="text-#33FF33 text-base font-semibold">Payment sent successfully!</p>
        <div>
          <p class="text-sm text-#888 mb-1">Transaction Hash</p>
          <code class="font-mono text-sm text-#888 break-all">{{ paymentResult.txHash }}</code>
        </div>
        <a
          :href="paymentResult.explorerUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-center px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
        >
          View on XRPL Explorer
        </a>
      </div>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-#FF3333 text-sm">{{ error }}</p>
  </div>
</template>
