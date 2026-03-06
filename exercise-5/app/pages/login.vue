<script setup lang="ts">
const router = useRouter()
const { authenticated, loading, error, login } = useAuth()

const email = ref('')
const password = ref('')

watch(authenticated, (val) => {
  if (val) router.push('/admin')
})

async function handleLogin() {
  try {
    await login(email.value, password.value)
    router.push('/admin')
  }
  catch {
    // error is handled by useAuth
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    <h1 class="text-4xl font-bold tracking-tight">Admin Login</h1>

    <form
      class="bg-#111 border border-#222 p-6 w-full max-w-sm flex flex-col gap-4"
      @submit.prevent="handleLogin"
    >
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full bg-#111 border border-#222 text-white px-4 py-3 focus:outline-none focus:border-white placeholder-#888"
      />

      <p v-if="error" class="text-#FF3333 text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading || !email || !password"
        class="px-6 py-3 bg-white text-black font-semibold hover:bg-#eee active:bg-#ccc disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
      >
        {{ loading ? '...' : 'Login' }}
      </button>
    </form>
  </div>
</template>
