<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans">
    <nav class="border-b border-#222 px-6 py-4">
      <div class="max-w-3xl mx-auto">
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight hover:text-#888 transition-colors duration-150">
          XRP Wallet
        </NuxtLink>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-6 py-16">
      <slot />
    </main>
  </div>
</template>
