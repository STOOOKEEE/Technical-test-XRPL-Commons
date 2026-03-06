<script setup lang="ts">
import type { IComment } from '~~/types'

interface Props {
  comment: IComment
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false,
})

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="bg-#111 border border-#222 p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="font-medium">{{ props.comment.author }}</span>
          <span class="text-sm text-#888">{{ formatDate(props.comment.createdAt) }}</span>
        </div>
        <p class="text-base leading-relaxed whitespace-pre-wrap break-words">
          {{ props.comment.content }}
        </p>
      </div>
      <div v-if="props.isAdmin" class="flex gap-2 shrink-0">
        <button
          class="px-3 py-1 border border-white text-white text-sm font-semibold hover:bg-white hover:text-black transition-colors duration-150"
          @click="emit('edit', props.comment._id)"
        >
          Edit
        </button>
        <button
          class="px-3 py-1 border border-error text-error text-sm font-semibold hover:bg-error hover:text-black transition-colors duration-150"
          @click="emit('delete', props.comment._id)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
