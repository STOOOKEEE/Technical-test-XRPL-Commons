export function useAuth() {
  const authenticated = useState<boolean>('auth', () => false)
  const email = useState<string>('auth-email', () => '')
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<string>('auth-error', () => '')

  async function checkAuth() {
    try {
      const data = await $fetch<{ authenticated: boolean; email?: string }>('/api/auth/me')
      authenticated.value = data.authenticated
      email.value = data.email ?? ''
    }
    catch {
      authenticated.value = false
      email.value = ''
    }
  }

  async function login(emailInput: string, password: string) {
    loading.value = true
    error.value = ''
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: emailInput, password },
      })
      authenticated.value = true
      email.value = emailInput
    }
    catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      error.value = apiErr.data?.message ?? 'Login failed'
      throw err
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    }
    finally {
      authenticated.value = false
      email.value = ''
    }
  }

  return { authenticated, email, loading, error, checkAuth, login, logout }
}
