<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h1 class="text-3xl font-bold">Top Tracks</h1>
      <TimeRangeSelector v-model="timeRange" />
    </div>

    <div class="bg-spotify-dark rounded-xl overflow-hidden">
      <template v-if="loading">
        <SkeletonRow v-for="i in 15" :key="i" class="px-4 border-b border-white/5" />
      </template>
      <TrackRow
        v-else
        v-for="(track, i) in tracks"
        :key="track.id"
        :track="track"
        :rank="i + 1"
        class="px-4 border-b border-white/5 last:border-0"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStatsStore } from '@/stores/stats'
import TrackRow from '@/components/TrackRow.vue'
import SkeletonRow from '@/components/SkeletonRow.vue'
import TimeRangeSelector from '@/components/TimeRangeSelector.vue'

const stats = useStatsStore()
const timeRange = ref('medium_term')
const tracks = ref([])
const loading = ref(true)

async function load() {
  loading.value = true
  tracks.value = await stats.fetchTopTracks(timeRange.value, 50)
  loading.value = false
}

watch(timeRange, load)
onMounted(load)
</script>
