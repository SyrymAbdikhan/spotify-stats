<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Recently Played</h1>

    <div class="bg-spotify-dark rounded-xl overflow-hidden">
      <template v-if="loading">
        <SkeletonRow v-for="i in 15" :key="i" class="px-4 border-b border-white/5" />
      </template>
      <div
        v-else
        v-for="(item, i) in items"
        :key="`${item.track.id}-${item.played_at}-${i}`"
        class="flex items-center gap-4 py-3 px-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
      >
        <span class="w-6 text-right text-spotify-gray text-sm shrink-0">{{ i + 1 }}</span>

        <a
          :href="item.track.external_urls?.spotify"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 rounded overflow-hidden"
          :title="`Open ${item.track.name} in Spotify`"
        >
          <img
            v-if="item.track.album?.images?.[0]?.url"
            :src="item.track.album.images[0].url"
            :alt="item.track.album.name"
            class="w-12 h-12 object-cover hover:opacity-80 transition-opacity"
            loading="lazy"
          />
          <div v-else class="w-12 h-12 bg-spotify-card flex items-center justify-center">
            <svg class="w-5 h-5 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </a>

        <div class="flex-1 min-w-0">
          <a
            :href="item.track.external_urls?.spotify"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-sm truncate block hover:text-white hover:underline transition-colors"
          >{{ item.track.name }}</a>

          <p class="text-xs text-spotify-gray truncate">
            <template v-for="(artist, ai) in item.track.artists" :key="artist.id">
              <span v-if="ai > 0">, </span>
              <RouterLink
                :to="`/artist/${artist.id}`"
                class="hover:text-white hover:underline transition-colors"
              >{{ artist.name }}</RouterLink>
            </template>
            <span class="opacity-70"> · {{ item.track.album?.name }}</span>
          </p>
        </div>

        <div class="text-right shrink-0">
          <p class="text-xs text-spotify-gray">{{ timeAgo(item.played_at) }}</p>
          <p class="text-[10px] text-spotify-gray/50">{{ formatDate(item.played_at) }}</p>
        </div>
        <span class="text-xs text-spotify-gray shrink-0 ml-2">{{ formatDuration(item.track.duration_ms) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStatsStore } from '@/stores/stats'
import SkeletonRow from '@/components/SkeletonRow.vue'

const stats = useStatsStore()
const items = ref([])
const loading = ref(true)

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function formatDuration(ms) {
  if (!ms) return '--:--'
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  return `${m}:${s}`
}

onMounted(async () => {
  items.value = await stats.fetchRecentlyPlayed(50)
  loading.value = false
})
</script>
