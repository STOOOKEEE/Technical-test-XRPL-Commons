<script setup lang="ts">
const props = defineProps<{
  score: number
}>()

const TOTAL_SEGMENTS = 10
const percentage = computed(() => props.score * 10)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="text-6xl font-bold tracking-tight">
      {{ props.score }}<span class="text-2xl text-#888">/10</span>
    </div>
    <div class="w-full h-2 bg-#222 overflow-hidden">
      <div
        class="h-full bg-white transition-all duration-700 ease-out"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <div class="flex w-full justify-between">
      <span
        v-for="i in TOTAL_SEGMENTS + 1"
        :key="i"
        class="text-xs"
        :class="(i - 1) <= props.score ? 'text-white' : 'text-#888'"
      >
        {{ i - 1 }}
      </span>
    </div>
  </div>
</template>
