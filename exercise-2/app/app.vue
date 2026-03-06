<template>
  <div class="min-h-screen bg-black text-white font-sans">
    <nav class="border-b border-#222 px-6 py-4">
      <div class="max-w-3xl mx-auto">
        <span class="text-lg font-semibold tracking-tight">Dockerized Nuxt App</span>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-6 py-16">
      <div class="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <h1 class="text-4xl font-bold tracking-tight text-center">
          Nuxt 4 on Docker
        </h1>
        <p class="text-base text-#888 leading-relaxed text-center max-w-lg">
          This Nuxt application is running inside a Docker container with Hot Module Replacement enabled.
        </p>
        <p class="text-sm text-#888">
          Edit <code class="font-mono text-white">app/app.vue</code> to see HMR in action.
        </p>
      </div>
    </main>
  </div>
</template>
