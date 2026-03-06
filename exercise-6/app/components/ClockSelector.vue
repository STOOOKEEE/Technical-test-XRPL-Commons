<script setup lang="ts">
import type { IClock } from '~/types'
import { CLOCKS } from '~/utils/clocks'

const selectedClock = defineModel<IClock | null>({ default: null })

function onSelect(event: Event) {
  const target = event.target as HTMLSelectElement
  const index = Number(target.value)
  selectedClock.value = index >= 0 ? CLOCKS[index] : null
}

const selectedIndex = computed(() => {
  if (!selectedClock.value) return -1
  return CLOCKS.findIndex(c => c.name === selectedClock.value?.name)
})
</script>

<template>
  <div>
    <label class="block text-sm text-#888 mb-2">Select a clock</label>
    <select
      :value="selectedIndex"
      class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white"
      @change="onSelect"
    >
      <option :value="-1" disabled>
        Choose a NISAR clock...
      </option>
      <option
        v-for="(clock, index) in CLOCKS"
        :key="clock.name"
        :value="index"
      >
        {{ clock.name }}
      </option>
    </select>
  </div>
</template>
