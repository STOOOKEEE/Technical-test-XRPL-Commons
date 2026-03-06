<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] gap-8">
    <h1 class="text-4xl font-bold tracking-tight text-center">
      NISAR Clock NFT Studio
    </h1>
    <p class="text-base text-#888 leading-relaxed text-center max-w-lg">
      Select a NASA NISAR clock, edit its colors and brightness, then mint it as an NFT on the XRPL Testnet via your Xaman wallet.
    </p>
    <NuxtLink
      to="/mint"
      class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
    >
      Start Creating
    </NuxtLink>
  </div>
</template>
