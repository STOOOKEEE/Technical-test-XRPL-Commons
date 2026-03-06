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
      const message = err instanceof Error ? err.message : 'Failed to evaluate idea'
      error.value = message
    }
    finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, result, evaluate }
}
