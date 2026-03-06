<script setup lang="ts">
const { checkAuth } = useAuth()

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
