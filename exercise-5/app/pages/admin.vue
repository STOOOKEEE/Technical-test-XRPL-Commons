<script setup lang="ts">
const router = useRouter()
const { authenticated } = useAuth()
const { comments, loading, error, fetchComments, updateComment, deleteComment } = useComments()

const editingId = ref<string | null>(null)
const editingContent = ref('')
const deleteError = ref('')

watch(authenticated, (val) => {
  if (!val) router.push('/login')
}, { immediate: true })

onMounted(() => {
  if (authenticated.value) fetchComments()
})

function startEdit(id: string) {
  const comment = comments.value.find((c) => c._id === id)
  if (!comment) return
  editingId.value = id
  editingContent.value = comment.content
}

async function handleSave(content: string) {
  if (!editingId.value) return
  try {
    await updateComment(editingId.value, content)
    editingId.value = null
    editingContent.value = ''
  }
  catch {
    // error is handled by useComments
  }
}

async function handleDelete(id: string) {
  deleteError.value = ''
  try {
    await deleteComment(id)
  }
  catch {
    deleteError.value = 'Failed to delete comment'
  }
}
</script>

<template>
  <div v-if="authenticated" class="flex flex-col gap-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight mb-4">Admin Panel</h1>
      <p class="text-base text-#888 leading-relaxed">
        Edit or delete comments.
      </p>
    </div>

    <p v-if="error || deleteError" class="text-#FF3333 text-sm">
      {{ error || deleteError }}
    </p>

    <div v-if="loading" class="text-center text-#888 py-8">Loading...</div>

    <div v-else-if="comments.length === 0" class="text-center text-#888 py-8">
      No comments to manage.
    </div>

    <div v-else class="flex flex-col gap-4">
      <CommentCard
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
        :is-admin="true"
        @edit="startEdit"
        @delete="handleDelete"
      />
    </div>

    <EditModal
      :visible="editingId !== null"
      :initial-content="editingContent"
      @close="editingId = null"
      @save="handleSave"
    />
  </div>
</template>
