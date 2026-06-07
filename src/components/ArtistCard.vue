<template>
  <div class="group flex flex-col gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
    <!-- Image: internal artist detail page -->
    <div class="relative">
      <RouterLink :to="`/artist/${artist.id}`" class="aspect-square overflow-hidden rounded-full bg-spotify-card block">
        <img
          v-if="artist.images?.[0]?.url"
          :src="artist.images[0].url"
          :alt="artist.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-spotify-gray">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      </RouterLink>
      <div v-if="rank" class="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-xs font-bold px-2 py-0.5 rounded-full z-10">
        #{{ rank }}
      </div>
    </div>

    <div class="flex items-start justify-between gap-1">
      <div class="min-w-0">
        <!-- Name: internal page -->
        <RouterLink
          :to="`/artist/${artist.id}`"
          class="font-semibold text-sm leading-tight truncate block hover:text-spotify-green transition-colors"
        >{{ artist.name }}</RouterLink>
        <p class="text-xs text-spotify-gray mt-0.5">Artist</p>
      </div>
      <!-- Spotify external link -->
      <a
        v-if="artist.external_urls?.spotify"
        :href="artist.external_urls.spotify"
        target="_blank"
        rel="noopener noreferrer"
        title="Open in Spotify"
        class="shrink-0 mt-0.5 text-spotify-gray hover:text-spotify-green transition-colors"
        @click.stop
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  artist: { type: Object, required: true },
  rank: { type: Number, default: null }
})
</script>
