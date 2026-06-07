<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-spotify-black relative overflow-hidden px-4">
    <!-- background glow -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-spotify-green/5 blur-3xl pointer-events-none" />

    <div class="relative z-10 flex flex-col items-center text-center max-w-lg">
      <!-- logo -->
      <div class="flex items-center gap-3 mb-12">
        <div class="w-14 h-14 rounded-full bg-spotify-green flex items-center justify-center">
          <SpotifyIcon class="w-8 h-8 text-black" />
        </div>
        <span class="text-2xl font-bold tracking-tight">Spotify Stats</span>
      </div>

      <h1 class="text-5xl font-bold leading-tight mb-4">
        Your music,<br />
        <span class="text-spotify-green">visualised.</span>
      </h1>

      <p class="text-spotify-gray text-lg mb-10 leading-relaxed">
        Discover your top artists, tracks, and listening patterns
        powered by your real Spotify data.
      </p>

      <button @click="handleLogin" :disabled="loading" class="btn-spotify text-base px-10 py-4 gap-3">
        <SpotifyIcon class="w-5 h-5" />
        <span>{{ loading ? 'Redirecting…' : 'Login with Spotify' }}</span>
      </button>

      <p class="mt-6 text-xs text-spotify-gray/60">
        Read-only access · No data stored on any server
      </p>
    </div>

    <!-- Decorative floating cards -->
    <div class="absolute bottom-12 left-8 hidden lg:flex flex-col gap-2 opacity-20 rotate-[-4deg]">
      <div class="w-48 h-48 bg-spotify-card rounded-xl" />
    </div>
    <div class="absolute top-16 right-12 hidden lg:flex flex-col gap-2 opacity-20 rotate-[6deg]">
      <div class="w-36 h-36 bg-spotify-card rounded-xl" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SpotifyIcon from '@/components/icons/SpotifyIcon.vue'

const auth = useAuthStore()
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await auth.login()
}
</script>
