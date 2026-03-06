<script setup lang="ts">
const {
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
} = useXaman()

const props = defineProps<{
  getBlob: () => Promise<Blob | null>
  ready: boolean
}>()

const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const ipfsUrl = ref<string | null>(null)

async function handleUploadAndMint() {
  const blob = await props.getBlob()
  if (!blob) return

  isUploading.value = true
  uploadError.value = null
  ipfsUrl.value = null
  resetMint()

  try {
    const formData = new FormData()
    formData.append('file', blob, 'edited-clock.png')

    const response = await $fetch<{ ipfsHash: string; ipfsUrl: string }>('/api/upload-ipfs', {
      method: 'POST',
      body: formData,
    })

    ipfsUrl.value = response.ipfsUrl
    await mintNftWithXaman(response.ipfsUrl)
  }
  catch (err: unknown) {
    uploadError.value = err instanceof Error ? err.message : 'Upload failed'
  }
  finally {
    isUploading.value = false
  }
}

const combinedError = computed(() => uploadError.value || error.value)
const isProcessing = computed(() => isUploading.value || isMinting.value)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-2xl font-semibold">
      Mint with Xaman
    </h2>

    <div v-if="!walletAddress" class="flex flex-col gap-4">
      <p class="text-sm text-#888">
        Connect your Xaman wallet to mint the edited NFT on XRPL.
      </p>
      <button
        :disabled="isConnecting"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        @click="connect"
      >
        <span v-if="isConnecting">Connecting...</span>
        <span v-else>Connect with Xaman</span>
      </button>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div class="bg-#111 border border-#222 p-4">
        <p class="text-sm text-#888 mb-1">
          Connected Wallet
        </p>
        <code class="font-mono text-sm text-white break-all">{{ walletAddress }}</code>
        <button
          class="block mt-2 text-sm text-#888 hover:text-white transition-colors duration-150"
          @click="disconnect"
        >
          Disconnect
        </button>
      </div>

      <button
        :disabled="isProcessing || !ready"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        @click="handleUploadAndMint"
      >
        <span v-if="isUploading">Uploading to IPFS...</span>
        <span v-else-if="isMinting">Minting NFT...</span>
        <span v-else>Upload to IPFS & Mint NFT</span>
      </button>

      <div v-if="qrUrl" class="bg-#111 border border-#222 p-6 flex flex-col items-center gap-4">
        <p class="text-sm text-#888">
          Scan with Xaman to sign the transaction
        </p>
        <img :src="qrUrl" alt="Xaman QR Code" class="w-48 h-48">
      </div>

      <div v-if="ipfsUrl && !mintResult" class="text-sm text-#888">
        IPFS: <code class="font-mono">{{ ipfsUrl }}</code>
      </div>

      <div v-if="mintResult" class="bg-#111 border border-#222 p-6 flex flex-col gap-4">
        <p class="text-#33FF33 text-base font-semibold">
          NFT minted successfully via Xaman!
        </p>
        <div v-if="ipfsUrl">
          <p class="text-sm text-#888 mb-1">
            IPFS URI
          </p>
          <code class="font-mono text-sm text-#888 break-all">{{ ipfsUrl }}</code>
        </div>
        <div>
          <p class="text-sm text-#888 mb-1">
            Transaction Hash
          </p>
          <code class="font-mono text-sm text-#888 break-all">{{ mintResult.txHash }}</code>
        </div>
        <a
          :href="mintResult.explorerUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full text-center px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
        >
          View on XRPL Explorer
        </a>
      </div>
    </div>

    <p v-if="combinedError" class="text-#FF3333 text-sm">
      {{ combinedError }}
    </p>
  </div>
</template>
