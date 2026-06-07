<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-spotify-black gap-4">
    <div v-if="error" class="text-center max-w-sm px-4">
      <p class="text-red-400 font-semibold mb-2">Authentication failed</p>
      <p class="text-spotify-gray text-sm mb-6">{{ error }}</p>
      <RouterLink to="/" class="btn-spotify text-sm">Back to home</RouterLink>
    </div>
    <template v-else>
      <div class="w-10 h-10 border-2 border-spotify-green border-t-transparent rounded-full animate-spin" />
      <p class="text-spotify-gray text-sm">Connecting to Spotify…</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const error = ref(null)

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  const err = params.get('error')

  if (err) {
    error.value = `Spotify returned: ${err}`
    return
  }

  if (!code || !state) {
    error.value = 'Missing code or state parameter.'
    return
  }

  try {
    await auth.handleCallback(code, state)
    router.replace('/dashboard')
  } catch (e) {
    error.value = e.message
  }
})
</script>
