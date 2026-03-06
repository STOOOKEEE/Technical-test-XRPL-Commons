<script setup lang="ts">
import { MAX_AUTHOR_LENGTH, MAX_CONTENT_LENGTH } from '~~/shared/constants'

const emit = defineEmits<{
  submitted: []
}>()

const author = ref('')
const content = ref('')
const submitting = ref(false)
const error = ref('')

const { addComment } = useComments()

async function handleSubmit() {
  if (!author.value.trim() || !content.value.trim()) return

  submitting.value = true
  error.value = ''
  try {
    await addComment(author.value.trim(), content.value.trim())
    author.value = ''
    content.value = ''
    emit('submitted')
  }
  catch (err: unknown) {
    const apiErr = err as { data?: { message?: string } }
    error.value = apiErr.data?.message ?? 'Failed to post comment'
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="bg-#111 border border-#222 p-6 flex flex-col gap-4" @submit.prevent="handleSubmit">
    <h2 class="text-2xl font-semibold">Post a Comment</h2>
    <input
      v-model="author"
      type="text"
      placeholder="Your name"
      :maxlength="MAX_AUTHOR_LENGTH"
      class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888"
    />
    <textarea
      v-model="content"
      placeholder="Write your comment..."
      :maxlength="MAX_CONTENT_LENGTH"
      rows="4"
      class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888 resize-y"
    />
    <p v-if="error" class="text-error text-sm">{{ error }}</p>
    <button
      type="submit"
      :disabled="submitting || !author.trim() || !content.trim()"
      class="self-end px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
    >
      {{ submitting ? '...' : 'Post' }}
    </button>
  </form>
</template>
