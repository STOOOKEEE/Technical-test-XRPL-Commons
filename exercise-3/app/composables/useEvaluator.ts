import type { IEvaluationResult } from '~/types'

export function useEvaluator() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const result = ref<IEvaluationResult | null>(null)

  async function evaluate(idea: string) {
    isLoading.value = true
    error.value = null
    result.value = null

    try {
      const response = await $fetch<IEvaluationResult>('/api/evaluate', {
        method: 'POST',
        body: { idea },
      })

      result.value = response
    }
    catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const fetchError = err as { data?: { statusMessage?: string } }
        error.value = fetchError.data?.statusMessage || 'Failed to evaluate idea'
      }
      else {
        error.value = err instanceof Error ? err.message : 'Failed to evaluate idea'
      }
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, result, evaluate }
}
