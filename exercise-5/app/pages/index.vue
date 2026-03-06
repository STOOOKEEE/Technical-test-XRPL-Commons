<script setup lang="ts">
const { comments, loading, error, fetchComments } = useComments()

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight mb-4">Comments</h1>
      <p class="text-base text-#888 leading-relaxed">
        Share your thoughts. All comments are public.
      </p>
    </div>

    <CommentForm @submitted="fetchComments" />

    <p v-if="error" class="text-#FF3333 text-sm">{{ error }}</p>

    <div v-if="loading" class="text-center text-#888 py-8">Loading...</div>

    <div v-else-if="comments.length === 0" class="text-center text-#888 py-8">
      No comments yet. Be the first to post!
    </div>

    <div v-else class="flex flex-col gap-4">
      <CommentCard
        v-for="comment in comments"
        :key="comment._id"
        :comment="comment"
      />
    </div>
  </div>
</template>
