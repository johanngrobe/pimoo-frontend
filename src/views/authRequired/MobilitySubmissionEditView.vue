<template>
  <div>
    <BaseSubheading>Mobilitätscheck bearbeiten</BaseSubheading>
    <MobilityForm :editMode="true" :item="item" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchItem } from '@/composables/crud'
import MobilityForm from '@/components/form/MobilityForm.vue'

const route = useRoute()
const item = ref()

async function fetchData() {
  const id = route.params.mobilitySubmissionId

  item.value = await fetchItem(`submission/mobility/${id}`)
}

watch(() => route.params.mobilitySubmissionId, fetchData, { immediate: true })

onMounted(fetchData)
</script>

<style></style>
