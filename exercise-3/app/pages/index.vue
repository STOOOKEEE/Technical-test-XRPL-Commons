<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] gap-8">
    <h1 class="text-4xl font-bold tracking-tight text-center">
      Business Idea Evaluator
    </h1>
    <p class="text-base text-#888 leading-relaxed text-center max-w-lg">
      Submit your business idea and let AI evaluate its credibility with a score from 0 to 10.
    </p>
    <NuxtLink
      to="/agent"
      class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
    >
      Evaluate an Idea
    </NuxtLink>
  </div>
</template>
