<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] gap-8">
    <h1 class="text-4xl font-bold tracking-tight text-center">
      Xaman Wallet
    </h1>
    <p class="text-base text-#888 leading-relaxed text-center max-w-lg">
      Connect your Xaman wallet and send XRP to any address on the XRPL.
    </p>
    <NuxtLink
      to="/wallet"
      class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc transition-colors duration-150"
    >
      Connect Wallet
    </NuxtLink>
  </div>
</template>
