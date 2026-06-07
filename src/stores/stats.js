import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useStatsStore = defineStore('stats', () => {
  const auth = useAuthStore()

  const topArtists = ref({})  // { short_term: [...], medium_term: [...], long_term: [...] }
  const topTracks = ref({})  // same here
  const recentlyPlayed = ref(null)

  // separate long_term track list for artist detail
  const longTermFull = ref([])
  const longTermFullDone = ref(false)
  const longTermFetching = ref(false)

  async function fetchTopArtists(timeRange = 'medium_term', limit = 50) {
    const cached = topArtists.value[timeRange]
    if (cached && cached.length >= limit) return cached
    const data = await auth.spotifyGet(`/me/top/artists?time_range=${timeRange}&limit=${limit}`)
    topArtists.value[timeRange] = data.items
    return data.items
  }

  async function fetchTopTracks(timeRange = 'medium_term', limit = 50) {
    const cached = topTracks.value[timeRange]
    if (cached && cached.length >= limit) return cached
    const data = await auth.spotifyGet(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`)
    topTracks.value[timeRange] = data.items
    return data.items
  }

  async function fetchRecentlyPlayed(limit = 50) {
    if (recentlyPlayed.value) return recentlyPlayed.value
    const data = await auth.spotifyGet(`/me/player/recently-played?limit=${limit}`)
    recentlyPlayed.value = data.items
    return data.items
  }

  // pages are pushed into longTermFull as they arrive (progressive load).
  async function fetchLongTermFull(maxTracks = 200) {
    if (longTermFullDone.value || longTermFetching.value) return
    longTermFetching.value = true

    try {
      const pageSize = 50
      while (longTermFull.value.length < maxTracks) {
        const remaining = maxTracks - longTermFull.value.length
        const limit = Math.min(pageSize, remaining)
        const data = await auth.spotifyGet(
          `/me/top/tracks?time_range=long_term&limit=${limit}&offset=${longTermFull.value.length}`
        )
        const items = data.items || []
        // extending the longTermFull array with the new items
        longTermFull.value = [...longTermFull.value, ...items]
        if (items.length < limit) break  // no more tracks
      }
    } finally {
      longTermFetching.value = false
      longTermFullDone.value = true
      // populating the standard 50-item cache if empty
      if (!topTracks.value['long_term'] && longTermFull.value.length) {
        topTracks.value['long_term'] = longTermFull.value.slice(0, 50)
      }
    }
  }

  async function fetchArtistDetail(artistId) {
    fetchLongTermFull(500)  // loading tracks in the background
    return auth.spotifyGet(`/artists/${artistId}`)
  }

  function clearCache() {
    topArtists.value = {}
    topTracks.value = {}
    recentlyPlayed.value = null
    longTermFull.value = []
    longTermFullDone.value = false
    longTermFetching.value = false
  }

  return {
    topArtists,
    topTracks,
    recentlyPlayed,
    longTermFull,
    longTermFullDone,
    longTermFetching,
    fetchTopArtists,
    fetchTopTracks,
    fetchRecentlyPlayed,
    fetchLongTermFull,
    fetchArtistDetail,
    clearCache
  }
})
