import type { INftMintResult } from '~/types'
import { XRPL_EXPLORER_BASE_URL } from '~/utils/constants'

export function useXrplNft() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<INftMintResult | null>(null)

  async function mintNft(imageUrl: string) {
    isLoading.value = true
    error.value = null
    result.value = null

    try {
      const response = await $fetch<{ txHash: string }>('/api/mint', {
        method: 'POST',
        body: { imageUrl },
      })

      result.value = {
        txHash: response.txHash,
        explorerUrl: `${XRPL_EXPLORER_BASE_URL}/${response.txHash}`,
      }
    }
    catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to mint NFT'
      error.value = message
    }
    finally {
      isLoading.value = false
    }
  }

  function reset() {
    result.value = null
    error.value = null
  }

  return { isLoading, error, result, mintNft, reset }
}
