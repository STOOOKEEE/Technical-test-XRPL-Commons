<script setup lang="ts">
import { MAX_CONTENT_LENGTH } from '~~/shared/constants'

interface Props {
  visible: boolean
  initialContent: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [content: string]
}>()

const content = ref(props.initialContent)
const modalRef = ref<HTMLElement | null>(null)

watch(() => props.initialContent, (val) => {
  content.value = val
})

watch(() => props.visible, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKeydown)
  }
  else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'Tab') trapFocus(e)
}

function trapFocus(e: KeyboardEvent) {
  if (!modalRef.value) return
  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'button, textarea, input, [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

function handleSave() {
  if (!content.value.trim()) return
  emit('save', content.value.trim())
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.visible"
      :style="{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.8)' }"
      @click="handleBackdropClick"
    >
      <div ref="modalRef" class="bg-#111 border border-#222 p-6 w-full max-w-lg flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold text-white">Edit Comment</h2>
          <button
            class="text-#888 hover:text-white text-2xl leading-none transition-colors duration-150"
            @click="emit('close')"
          >
            &times;
          </button>
        </div>
        <textarea
          v-model="content"
          rows="6"
          :maxlength="MAX_CONTENT_LENGTH"
          class="w-full bg-black border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888 resize-y"
        />
        <div class="flex justify-end gap-3">
          <button
            class="px-6 py-3 border border-white text-white font-semibold hover:bg-white hover:text-black transition-colors duration-150"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            :disabled="!content.trim()"
            class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            @click="handleSave"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
