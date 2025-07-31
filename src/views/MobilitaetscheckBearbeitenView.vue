<template>
  <div>
    <BaseSubheading>Mobilitätscheck bearbeiten</BaseSubheading>
    <MobilitaetscheckFormular :editMode="true" :item="item" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchItem } from '@/composables/crud'
import MobilitaetscheckFormular from '@/components/MobilitaetscheckFormular.vue'

const route = useRoute()
const item = ref()

async function fetchData() {
  const id = route.params.eingabeId

  item.value = await fetchItem(`mobilitaetscheck/eingabe/${id}`)
}

watch(() => route.params.eingabeId, fetchData, { immediate: true })

onMounted(fetchData)
</script>

<style></style>
