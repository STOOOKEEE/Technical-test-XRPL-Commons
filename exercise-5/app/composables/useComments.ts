import type { IComment } from '~~/types'

export function useComments() {
  const comments = useState<IComment[]>('comments', () => [])
  const loading = useState<boolean>('comments-loading', () => false)
  const error = useState<string>('comments-error', () => '')

  async function fetchComments() {
    loading.value = true
    error.value = ''
    try {
      comments.value = await $fetch<IComment[]>('/api/comments')
    }
    catch {
      error.value = 'Failed to load comments'
    }
    finally {
      loading.value = false
    }
  }

  async function addComment(author: string, content: string) {
    error.value = ''
    try {
      const comment = await $fetch<IComment>('/api/comments', {
        method: 'POST',
        body: { author, content },
      })
      comments.value = [comment, ...comments.value]
    }
    catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      error.value = apiErr.data?.message ?? 'Failed to add comment'
      throw err
    }
  }

  async function updateComment(id: string, content: string) {
    error.value = ''
    try {
      const updated = await $fetch<IComment>(`/api/admin/comments/${id}`, {
        method: 'PUT',
        body: { content },
      })
      comments.value = comments.value.map((c) =>
        c._id === id ? updated : c,
      )
    }
    catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      error.value = apiErr.data?.message ?? 'Failed to update comment'
      throw err
    }
  }

  async function deleteComment(id: string) {
    error.value = ''
    try {
      await $fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
      comments.value = comments.value.filter((c) => c._id !== id)
    }
    catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      error.value = apiErr.data?.message ?? 'Failed to delete comment'
      throw err
    }
  }

  return { comments, loading, error, fetchComments, addComment, updateComment, deleteComment }
}
