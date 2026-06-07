<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-for="range in ranges"
      :key="range.value"
      class="time-range-btn"
      :class="{ active: modelValue === range.value }"
      @click="$emit('update:modelValue', range.value)"
    >
      {{ range.label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true }
})
defineEmits(['update:modelValue'])

const ranges = [
  { value: 'short_term',  label: 'Last 4 weeks' },
  { value: 'medium_term', label: '6 months' },
  { value: 'long_term',   label: 'All time' }
]
</script>
