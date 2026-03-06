<script setup lang="ts">
import type { IClock } from '~/types'

const selectedClock = ref<IClock | null>(null)
const { isLoading, error, result, mintNft, reset } = useXrplNft()
const showModal = computed(() => result.value !== null)

async function handleMint() {
  if (!selectedClock.value) return
  await mintNft(selectedClock.value.imageUrl)
}

function closeModal() {
  reset()
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
      Mint a Clock NFT
    </h1>

    <ClockSelector v-model="selectedClock" />

    <div v-if="selectedClock" class="flex flex-col gap-8">
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
        @click="handleMint"
      >
        <span v-if="isLoading">Minting...</span>
        <span v-else>Generate NFT</span>
      </button>

      <p v-if="error" class="text-#FF3333 text-sm">
        {{ error }}
      </p>
    </div>

    <NftModal
      v-if="showModal && result"
      :result="result"
      @close="closeModal"
    />
  </div>
</template>
