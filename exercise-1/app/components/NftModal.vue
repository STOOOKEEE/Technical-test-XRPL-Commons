<script setup lang="ts">
import type { INftMintResult } from '~/types'

const props = defineProps<{
  result: INftMintResult
}>()

const emit = defineEmits<{
  close: []
}>()

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    @click="onBackdropClick"
  >
    <div class="bg-#111 border border-#222 p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">
          NFT Created
        </h2>
        <button
          class="text-#888 hover:text-white transition-colors duration-150 text-2xl leading-none"
          @click="emit('close')"
        >
          &times;
        </button>
      </div>

      <p class="text-#33FF33 text-base mb-4">
        Your NFT has been successfully minted!
      </p>

      <div class="mb-6">
        <p class="text-sm text-#888 mb-1">
          Transaction Hash
        </p>
        <code class="font-mono text-sm text-#888 break-all">
          {{ props.result.txHash }}
        </code>
      </div>

      <a
        :href="props.result.explorerUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full text-center px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
      >
        View on XRPL Explorer
      </a>
    </div>
  </div>
</template>
