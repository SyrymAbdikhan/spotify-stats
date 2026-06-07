<template>
  <div class="min-h-screen bg-spotify-black">
    <template v-if="auth.isAuthenticated">
      <NavBar />
      <div class="lg:pl-64">
        <main class="min-h-screen pt-20 px-6 pb-6 lg:pt-8 lg:px-8 lg:pb-8">
          <RouterView />
        </main>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const auth = useAuthStore()
</script>
