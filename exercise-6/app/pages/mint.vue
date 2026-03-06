<script setup lang="ts">
import type { IClock } from '~/types'

const selectedClock = ref<IClock | null>(null)
const editorRef = ref<{ getBlob: () => Promise<Blob | null>; imageLoaded: boolean } | null>(null)

const { isLoading, error: mintError, result: directMintResult, mintNft, reset: resetDirectMint } = useXrplNft()
const showModal = computed(() => directMintResult.value !== null)

const editorReady = computed(() => !!editorRef.value?.imageLoaded)

async function handleDirectMint() {
  if (!selectedClock.value) return
  await mintNft(selectedClock.value.imageUrl)
}

function closeModal() {
  resetDirectMint()
}

async function getEditorBlob(): Promise<Blob | null> {
  if (!editorRef.value) return null
  return editorRef.value.getBlob()
}

watch(selectedClock, () => {
  resetDirectMint()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <NuxtLink to="/" class="text-sm text-#888 hover:text-white transition-colors duration-150">
        &larr; Back to home
      </NuxtLink>
    </div>

    <h1 class="text-4xl font-bold tracking-tight">
      Create & Mint NFT
    </h1>

    <ClockSelector v-model="selectedClock" />

    <div v-if="selectedClock" class="flex flex-col gap-8">
      <!-- Direct mint (Exercise 1 journey) -->
      <div class="bg-#111 border border-#222 p-6">
        <img
          :src="selectedClock.imageUrl"
          :alt="selectedClock.name"
          class="w-full h-auto"
        >
        <p class="text-lg font-medium mt-4">
          {{ selectedClock.name }}
        </p>
      </div>

      <button
        :disabled="isLoading"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
        @click="handleDirectMint"
      >
        <span v-if="isLoading">Minting...</span>
        <span v-else>Mint Original (Direct URL)</span>
      </button>

      <p v-if="mintError" class="text-#FF3333 text-sm">
        {{ mintError }}
      </p>

      <!-- Separator -->
      <div class="border-t border-#222 pt-8">
        <h2 class="text-2xl font-semibold mb-2">
          Custom NFT
        </h2>
        <p class="text-sm text-#888">
          Edit the image below, then connect Xaman to upload to IPFS and mint.
        </p>
      </div>

      <!-- Image Editor -->
      <ImageEditor ref="editorRef" :clock="selectedClock" />

      <!-- Xaman Mint Flow -->
      <XamanMintFlow :get-blob="getEditorBlob" :ready="editorReady" />
    </div>

    <NftModal
      v-if="showModal && directMintResult"
      :result="directMintResult"
      @close="closeModal"
    />
  </div>
</template>
