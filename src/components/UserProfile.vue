<template>
  <div class="flex items-center gap-3 pt-4 border-t border-white/10">
    <img
      v-if="auth.userProfile?.images?.[0]?.url"
      :src="auth.userProfile.images[0].url"
      :alt="auth.userProfile.display_name"
      class="w-9 h-9 rounded-full object-cover"
    />
    <div v-else class="w-9 h-9 rounded-full bg-spotify-card flex items-center justify-center text-sm font-bold">
      {{ initials }}
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium truncate">{{ auth.userProfile?.display_name }}</p>
      <p class="text-xs text-spotify-gray truncate">{{ auth.userProfile?.email }}</p>
    </div>
    <button @click="handleLogout" title="Logout" class="p-1.5 rounded-md hover:bg-white/10 text-spotify-gray hover:text-white transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStatsStore } from '@/stores/stats'

const auth = useAuthStore()
const stats = useStatsStore()
const router = useRouter()

const initials = computed(() => {
  const name = auth.userProfile?.display_name || ''
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
})

function handleLogout() {
  auth.logout()
  stats.clearCache()
  router.push('/')
}
</script>
