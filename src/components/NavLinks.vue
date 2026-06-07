<template>
  <nav class="flex flex-col gap-1">
    <RouterLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="nav-link"
      active-class="active"
      @click="$emit('navigate')"
    >
      <component :is="link.icon" class="w-5 h-5 shrink-0" />
      {{ link.label }}
    </RouterLink>
  </nav>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

defineEmits(['navigate'])

const links = [
  { to: '/dashboard',   label: 'Overview',      icon: defineAsyncComponent(() => import('./icons/HomeIcon.vue')) },
  { to: '/top-artists', label: 'Top Artists',   icon: defineAsyncComponent(() => import('./icons/MicIcon.vue')) },
  { to: '/top-tracks',  label: 'Top Tracks',    icon: defineAsyncComponent(() => import('./icons/MusicIcon.vue')) },
  { to: '/recent',      label: 'Recent',        icon: defineAsyncComponent(() => import('./icons/ClockIcon.vue')) }
]
</script>
