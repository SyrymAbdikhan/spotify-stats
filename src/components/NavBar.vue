<template>
  <!-- Mobile top bar -->
  <header class="lg:hidden fixed top-0 inset-x-0 z-30 bg-spotify-dark border-b border-white/10 flex items-center justify-between px-4 h-14">
    <RouterLink to="/dashboard" class="flex items-center gap-2">
      <SpotifyIcon class="w-6 h-6 text-spotify-green" />
      <span class="font-bold text-sm">Spotify Stats</span>
    </RouterLink>
    <button @click="menuOpen = !menuOpen" class="p-2 rounded-md hover:bg-white/10">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          :d="menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
      </svg>
    </button>
  </header>

  <!-- Mobile overlay menu -->
  <Transition name="slide">
    <nav v-if="menuOpen" class="lg:hidden fixed inset-0 z-20 bg-spotify-dark pt-14 px-4 pb-6 flex flex-col">
      <NavLinks @navigate="menuOpen = false" />
      <div class="mt-auto">
        <UserProfile />
      </div>
    </nav>
  </Transition>

  <!-- Desktop sidebar -->
  <aside class="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-spotify-dark border-r border-white/10 p-6 z-20">
    <RouterLink to="/dashboard" class="flex items-center gap-2 mb-8">
      <SpotifyIcon class="w-7 h-7 text-spotify-green" />
      <span class="font-bold">Spotify Stats</span>
    </RouterLink>
    <NavLinks />
    <div class="mt-auto">
      <UserProfile />
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import NavLinks from './NavLinks.vue'
import UserProfile from './UserProfile.vue'
import SpotifyIcon from './icons/SpotifyIcon.vue'

const menuOpen = ref(false)
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
