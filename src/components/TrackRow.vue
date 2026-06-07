<template>
  <div class="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-white/5 transition-colors group">
    <span v-if="rank" class="w-6 text-right text-spotify-gray text-sm shrink-0">{{ rank }}</span>

    <!-- album art opens track in Spotify -->
    <a
      :href="track.external_urls?.spotify"
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0 rounded overflow-hidden"
      :title="`Open ${track.name} in Spotify`"
      @click.stop
    >
      <img
        v-if="track.album?.images?.[0]?.url"
        :src="track.album.images[0].url"
        :alt="track.album.name"
        class="w-12 h-12 object-cover hover:opacity-80 transition-opacity"
        loading="lazy"
      />
      <div v-else class="w-12 h-12 bg-spotify-card flex items-center justify-center">
        <svg class="w-5 h-5 text-spotify-gray" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      </div>
    </a>

    <!-- track info -->
    <div class="flex-1 min-w-0">
      <a
        :href="track.external_urls?.spotify"
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-sm truncate block hover:underline hover:text-white"
        :title="`Open ${track.name} in Spotify`"
        @click.stop
      >{{ track.name }}</a>

      <p class="text-xs text-spotify-gray truncate">
        <template v-for="(artist, i) in track.artists" :key="artist.id">
          <span v-if="i > 0">, </span>
          <RouterLink
            :to="`/artist/${artist.id}`"
            class="hover:text-white hover:underline transition-colors"
            @click.stop
          >{{ artist.name }}</RouterLink>
        </template>
        <span v-if="track.album?.name" class="opacity-70"> · {{ track.album.name }}</span>
      </p>
    </div>

    <slot name="extra" />

    <span class="text-xs text-spotify-gray shrink-0 ml-2">{{ formatDuration(track.duration_ms) }}</span>
  </div>
</template>

<script setup>
defineProps({
  track: { type: Object, required: true },
  rank: { type: Number, default: null }
})

function formatDuration(ms) {
  if (!ms) return '--:--'
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>
