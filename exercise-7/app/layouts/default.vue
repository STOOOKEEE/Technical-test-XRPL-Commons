<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans">
    <nav class="border-b border-#222 px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight hover:text-#888 transition-colors duration-150">
          XRPL Transaction Visualizer
        </NuxtLink>
        <ConnectionStatus />
      </div>
    </nav>
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
