<template>
  <div class="max-w-6xl mx-auto">
    <!-- header -->
    <div class="mb-8">
      <p class="text-spotify-gray text-sm mb-1">Good {{ greeting }},</p>
      <h1 class="text-3xl font-bold">{{ auth.userProfile?.display_name || 'there' }} 👋</h1>
    </div>

    <!-- top artists -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Top Artists</h2>
        <RouterLink to="/top-artists" class="text-sm text-spotify-gray hover:text-white transition-colors">
          See all →
        </RouterLink>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <template v-if="loading.artists">
          <SkeletonCard v-for="i in 5" :key="i" />
        </template>
        <ArtistCard v-else v-for="(artist, i) in topArtists" :key="artist.id" :artist="artist" :rank="i + 1" />
      </div>
    </section>

    <!-- top tracks -->
    <section class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Top Tracks</h2>
        <RouterLink to="/top-tracks" class="text-sm text-spotify-gray hover:text-white transition-colors">
          See all →
        </RouterLink>
      </div>
      <div class="bg-spotify-dark rounded-xl overflow-hidden divide-y divide-white/5">
        <template v-if="loading.tracks">
          <SkeletonRow v-for="i in 5" :key="i" class="px-4" />
        </template>
        <TrackRow
          v-else
          v-for="(track, i) in topTracks"
          :key="track.id"
          :track="track"
          :rank="i + 1"
          class="px-4"
        />
      </div>
    </section>

    <!-- recently played -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Recently Played</h2>
        <RouterLink to="/recent" class="text-sm text-spotify-gray hover:text-white transition-colors">
          See all →
        </RouterLink>
      </div>
      <div class="bg-spotify-dark rounded-xl overflow-hidden divide-y divide-white/5">
        <template v-if="loading.recent">
          <SkeletonRow v-for="i in 5" :key="i" class="px-4" />
        </template>
        <div
          v-else
          v-for="item in recentTracks"
          :key="`${item.track.id}-${item.played_at}`"
          class="flex items-center gap-4 py-3 px-4 hover:bg-white/5 transition-colors"
        >
          <a
            :href="item.track.external_urls?.spotify"
            target="_blank"
            rel="noopener noreferrer"
            class="shrink-0 rounded overflow-hidden"
            @click.stop
          >
            <img
              v-if="item.track.album?.images?.[0]?.url"
              :src="item.track.album.images[0].url"
              :alt="item.track.album.name"
              class="w-12 h-12 object-cover hover:opacity-80 transition-opacity"
            />
            <div v-else class="w-12 h-12 bg-spotify-card rounded" />
          </a>
          <div class="flex-1 min-w-0">
            <a
              :href="item.track.external_urls?.spotify"
              target="_blank"
              rel="noopener noreferrer"
              class="font-medium text-sm truncate block hover:underline hover:text-white"
              @click.stop
            >{{ item.track.name }}</a>
            <p class="text-xs text-spotify-gray truncate">
              <template v-for="(artist, i) in item.track.artists" :key="artist.id">
                <span v-if="i > 0">, </span>
                <RouterLink
                  :to="`/artist/${artist.id}`"
                  class="hover:text-white hover:underline transition-colors"
                >{{ artist.name }}</RouterLink>
              </template>
            </p>
          </div>
          <span class="text-xs text-spotify-gray shrink-0">{{ timeAgo(item.played_at) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStatsStore } from '@/stores/stats'
import ArtistCard from '@/components/ArtistCard.vue'
import TrackRow from '@/components/TrackRow.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'

const auth = useAuthStore()
const stats = useStatsStore()

const topArtists = ref([])
const topTracks = ref([])
const recentTracks = ref([])
const loading = ref({ artists: true, tracks: true, recent: true })

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
})

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

onMounted(async () => {
  const [a, t, r] = await Promise.allSettled([
    stats.fetchTopArtists('medium_term', 50),
    stats.fetchTopTracks('medium_term', 50),
    stats.fetchRecentlyPlayed(50)
  ])
  if (a.status === 'fulfilled') topArtists.value = a.value.slice(0, 5)
  loading.value.artists = false
  if (t.status === 'fulfilled') topTracks.value = t.value.slice(0, 5)
  loading.value.tracks = false
  if (r.status === 'fulfilled') recentTracks.value = r.value.slice(0, 5)
  loading.value.recent = false
})
</script>
