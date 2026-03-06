<script setup lang="ts">
const { connectionStatus, disconnect } = useXrplStream()

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-4xl font-bold tracking-tight">Live Transactions</h1>
      <p class="text-base text-#888 leading-relaxed mt-2">
        Real-time 3D visualization of XRPL ledger transactions, updated every 4 seconds.
      </p>
    </div>

    <div v-if="connectionStatus.error && !connectionStatus.reconnecting" class="text-sm text-#FF3333">
      {{ connectionStatus.error }}
    </div>

    <TransactionLegend />

    <ClientOnly>
      <TransactionVisualizer />
      <template #fallback>
        <div class="w-full h-[500px] border border-#222 bg-#111 flex items-center justify-center">
          <span class="text-#888 text-sm">Loading visualizer...</span>
        </div>
      </template>
    </ClientOnly>

    <TransactionFeed />
  </div>
</template>
