<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 class="text-3xl font-bold">Top Artists</h1>
      <TimeRangeSelector v-model="timeRange" />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <template v-if="loading">
        <SkeletonCard v-for="i in 20" :key="i" />
      </template>
      <ArtistCard
        v-else
        v-for="(artist, i) in artists"
        :key="artist.id"
        :artist="artist"
        :rank="i + 1"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStatsStore } from '@/stores/stats'
import ArtistCard from '@/components/ArtistCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import TimeRangeSelector from '@/components/TimeRangeSelector.vue'

const stats = useStatsStore()
const timeRange = ref('medium_term')
const artists = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  artists.value = await stats.fetchTopArtists(timeRange.value, 50)
  loading.value = false
}

watch(timeRange, load)
onMounted(load)
</script>
