<script setup lang="ts">
const { authenticated, logout } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans">
    <nav class="border-b border-#222 px-6 py-4">
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <NuxtLink
          to="/"
          class="text-lg font-semibold tracking-tight hover:text-#888 transition-colors duration-150"
        >
          Comment System
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink
            v-if="authenticated"
            to="/admin"
            class="text-sm text-#888 hover:text-white transition-colors duration-150"
          >
            Admin
          </NuxtLink>
          <button
            v-if="authenticated"
            class="text-sm text-#888 hover:text-white transition-colors duration-150"
            @click="logout"
          >
            Logout
          </button>
          <NuxtLink
            v-else
            to="/login"
            class="text-sm text-#888 hover:text-white transition-colors duration-150"
          >
            Admin Login
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-6 py-16">
      <slot />
    </main>
  </div>
</template>
