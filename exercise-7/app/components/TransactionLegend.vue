<script setup lang="ts">
const items = [
  { label: 'Payment', color: '#4488ff', shape: 'Sphere' },
  { label: 'Offer', color: '#44ff88', shape: 'Cube' },
  { label: 'NFT Mint', color: '#aa44ff', shape: 'Torus' },
  { label: 'Escrow', color: '#ffcc44', shape: 'Cone' },
  { label: 'Other', color: '#888888', shape: 'Particle' },
]
</script>

<template>
  <div class="flex flex-wrap gap-4 text-xs">
    <div
      v-for="item in items"
      :key="item.label"
      class="flex items-center gap-2"
    >
      <span
        class="w-3 h-3 rounded-sm"
        :style="{ backgroundColor: item.color }"
      />
      <span class="text-#888">{{ item.label }} ({{ item.shape }})</span>
    </div>
  </div>
</template>
