<template>
  <div class="max-w-3xl mx-auto">
    <!-- back button -->
    <button @click="router.back()" class="inline-flex items-center gap-2 text-spotify-gray hover:text-white text-sm mb-6 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>

    <div v-if="error" class="text-center py-16 text-spotify-gray">
      <p class="text-red-400 mb-2">Failed to load artist</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <template v-else>
      <!-- banner -->
      <div class="group relative rounded-2xl overflow-hidden mb-8 bg-spotify-dark">
        <div v-if="loadingArtist" class="h-72 skeleton" />
        <template v-else>
          <!-- pfp backdrop -->
          <div v-if="artist?.images?.[0]?.url" class="absolute inset-0">
            <img
              :src="artist.images[0].url"
              aria-hidden="true"
              class="w-full h-full object-cover scale-110 blur-2xl opacity-40"
            />
          </div>

          <!-- overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-spotify-black via-black/20 to-transparent z-10" />

          <!-- pfp -->
          <div class="relative h-72 flex items-center justify-center z-20">
            <img
              v-if="artist?.images?.[0]?.url"
              :src="artist.images[0].url"
              :alt="artist.name"
              class="h-full w-auto object-contain drop-shadow-2xl cursor-zoom-in"
              @click="lightboxOpen = true"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-24 h-24 text-spotify-gray/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>

          <!-- expand button -->
          <button
            v-if="artist?.images?.[0]?.url"
            @click="lightboxOpen = true"
            class="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            title="View full image"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>

          <!-- artist info -->
          <div class="absolute bottom-0 left-0 p-6 z-30">
            <p class="text-xs text-spotify-green font-semibold uppercase tracking-widest mb-1">Artist</p>
            <h1 class="text-4xl lg:text-5xl font-bold drop-shadow">{{ artist?.name }}</h1>
            <div class="flex flex-wrap items-center gap-3 mt-3 text-sm text-spotify-gray">
              <a
                v-if="artist?.external_urls?.spotify"
                :href="artist.external_urls.spotify"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spotify-green text-black text-xs font-bold hover:brightness-110 transition-all"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Open in Spotify
              </a>
            </div>
          </div>
        </template>
      </div>

      <!-- lightbox -->
      <Teleport to="body">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          @click.self="lightboxOpen = false"
        >
          <button
            @click="lightboxOpen = false"
            class="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            :src="artist?.images?.[0]?.url"
            :alt="artist?.name"
            class="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      </Teleport>

      <!-- top tracks -->
      <section>
        <h2 class="text-xl font-bold mb-4">
          <template v-if="loadingArtist">Your Top Tracks</template>
          <template v-else-if="userTracks.length">Your Top Tracks by {{ artist?.name }}</template>
        </h2>

        <!-- skeleton -->
        <div v-if="stats.longTermFull.length === 0 && !stats.longTermFullDone" class="bg-spotify-dark rounded-xl overflow-hidden">
          <SkeletonRow v-for="i in 5" :key="i" class="px-4 border-b border-white/5" />
        </div>

        <!-- track list -->
        <template v-else-if="userTracks.length">
          <div class="bg-spotify-dark rounded-xl overflow-hidden">
            <TrackRow
              v-for="(track, i) in visibleTracks"
              :key="track.id"
              :track="track"
              :rank="i + 1"
              class="px-4 border-b border-white/5 last:border-0"
            />
          </div>
          <div class="flex items-center justify-between mt-3">
            <p v-if="!stats.longTermFullDone" class="text-xs text-spotify-gray animate-pulse">
              Loading more tracks…
            </p>
            <span v-else />
            <!-- expand / collapse -->
            <button
              v-if="userTracks.length > LIMIT_MIN"
              @click="expanded = !expanded"
              class="text-xs text-spotify-gray hover:text-white transition-colors"
            >
              {{ expanded ? 'Show less ↑' : `Show more ↓` }}
            </button>
          </div>
        </template>

        <div v-else-if="stats.longTermFullDone" class="bg-spotify-dark rounded-xl p-8 text-center text-spotify-gray">
          <p class="text-sm">No tracks by this artist found in your top tracks.</p>
          <p class="text-xs mt-1 opacity-60">Visit their page on Spotify to explore their music.</p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStatsStore } from '@/stores/stats'
import TrackRow from '@/components/TrackRow.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'

const route = useRoute()
const router = useRouter()
const stats = useStatsStore()

const LIMIT_MIN = 5
const LIMIT_MAX = 15

const artist = ref(null)
const loadingArtist = ref(true)
const error = ref(null)
const expanded = ref(false)
const lightboxOpen = ref(false)

// reactively filters longTermFull as data arrive
const userTracks = computed(() => {
  const id = route.params.id
  const seen = new Set()
  return stats.longTermFull.filter((t) => {
    if (seen.has(t.id)) return false
    if (!t.artists?.some((a) => a.id === id)) return false
    seen.add(t.id)
    return true
  })
})

const visibleTracks = computed(() =>
  userTracks.value.slice(0, expanded.value ? LIMIT_MAX : LIMIT_MIN)
)

async function load(id) {
  loadingArtist.value = true
  error.value = null
  try {
    artist.value = await stats.fetchArtistDetail(id)
  } catch (e) {
    error.value = e.message
  } finally {
    loadingArtist.value = false
  }
}

watch(() => route.params.id, (id) => { expanded.value = false; lightboxOpen.value = false; load(id) })
onMounted(() => {
  load(route.params.id)
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightboxOpen.value = false })
})
</script>
