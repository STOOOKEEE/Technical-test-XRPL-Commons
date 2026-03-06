<script setup lang="ts">
import type { IClock } from '~/types'
import {
  MIN_BRIGHTNESS,
  MAX_BRIGHTNESS,
} from '~/utils/constants'

const props = defineProps<{
  clock: IClock
}>()

const { settings, applyEdits, exportBlob, resetSettings } = useImageEditor()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const imageLoaded = ref(false)

const proxiedImageUrl = computed(() => {
  return `/api/proxy-image?url=${encodeURIComponent(props.clock.imageUrl)}`
})

function onImageLoad() {
  imageLoaded.value = true
  redraw()
}

function redraw() {
  if (!canvasRef.value || !imageRef.value || !imageLoaded.value) return
  applyEdits(canvasRef.value, imageRef.value)
}

watch(() => [settings.brightness, settings.colorOverlay, settings.colorOpacity], redraw)

watch(() => props.clock, () => {
  imageLoaded.value = false
  resetSettings()
})

async function getBlob(): Promise<Blob | null> {
  if (!canvasRef.value) return null
  return exportBlob(canvasRef.value)
}

defineExpose({ getBlob, imageLoaded })
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-2xl font-semibold">
      Edit Image
    </h2>

    <img
      ref="imageRef"
      :src="proxiedImageUrl"
      :alt="props.clock.name"
      class="hidden"
      @load="onImageLoad"
    >

    <div class="bg-#111 border border-#222 p-4">
      <canvas ref="canvasRef" class="w-full h-auto" />
    </div>

    <div class="flex flex-col gap-4">
      <div>
        <label class="block text-sm text-#888 mb-2">
          Brightness: {{ settings.brightness }}%
        </label>
        <input
          v-model.number="settings.brightness"
          type="range"
          :min="MIN_BRIGHTNESS"
          :max="MAX_BRIGHTNESS"
          class="w-full accent-white"
        >
      </div>

      <div class="flex gap-4 items-end">
        <div>
          <label class="block text-sm text-#888 mb-2">Color Overlay</label>
          <input
            v-model="settings.colorOverlay"
            type="color"
            class="w-12 h-12 bg-#111 border border-#222 cursor-pointer"
          >
        </div>
        <div class="flex-1">
          <label class="block text-sm text-#888 mb-2">
            Color Opacity: {{ settings.colorOpacity }}%
          </label>
          <input
            v-model.number="settings.colorOpacity"
            type="range"
            :min="0"
            :max="100"
            class="w-full accent-white"
          >
        </div>
      </div>

      <button
        class="text-sm text-#888 hover:text-white transition-colors duration-150 self-start"
        @click="resetSettings"
      >
        Reset adjustments
      </button>
    </div>
  </div>
</template>
