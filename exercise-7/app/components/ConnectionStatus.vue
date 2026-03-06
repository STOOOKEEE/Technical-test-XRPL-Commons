<script setup lang="ts">
const { connectionStatus, retry } = useXrplStream()
</script>

<template>
  <div class="flex items-center gap-3 text-sm">
    <div class="flex items-center gap-2">
      <span
        class="w-2 h-2 rounded-full"
        :class="connectionStatus.connected ? 'bg-#33FF33' : connectionStatus.reconnecting ? 'bg-#ffcc44 animate-pulse' : 'bg-#FF3333'"
      />
      <span class="text-#888 font-mono text-xs">
        <template v-if="connectionStatus.connected">Connected</template>
        <template v-else-if="connectionStatus.reconnecting">
          Reconnecting ({{ connectionStatus.retryCount }})...
        </template>
        <template v-else>Disconnected</template>
      </span>
    </div>
    <button
      v-if="!connectionStatus.connected && !connectionStatus.reconnecting"
      class="px-3 py-1 border border-white text-white text-xs font-semibold hover:bg-white hover:text-black transition-colors duration-150"
      @click="retry"
    >
      Retry
    </button>
  </div>
</template>
