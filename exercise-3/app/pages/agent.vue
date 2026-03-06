<script setup lang="ts">
const idea = ref('')
const { isLoading, error, result, evaluate } = useEvaluator()

async function handleSubmit() {
  if (!idea.value.trim() || isLoading.value) return
  await evaluate(idea.value.trim())
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
      Describe your idea
    </h1>

    <div class="flex flex-col gap-4">
      <textarea
        v-model="idea"
        rows="5"
        :maxlength="2000"
        placeholder="Describe your business idea here..."
        class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888 resize-none"
        :disabled="isLoading"
        @keydown.meta.enter="handleSubmit"
        @keydown.ctrl.enter="handleSubmit"
      />
      <span class="text-xs text-#888 self-end">{{ idea.length }}/2000</span>

      <button
        :disabled="isLoading || !idea.trim()"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 self-end"
        @click="handleSubmit"
      >
        <span v-if="isLoading">Evaluating...</span>
        <span v-else>Send</span>
      </button>
    </div>

    <p v-if="error" class="text-#FF3333 text-sm">
      {{ error }}
    </p>

    <div v-if="result" class="bg-#111 border border-#222 p-6 flex flex-col gap-6">
      <ScoreGauge :score="result.score" />
      <p class="text-base text-#888 leading-relaxed text-center">
        {{ result.reasoning }}
      </p>
    </div>
  </div>
</template>
