<template>
  <div class="my-5">
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Mobilitätscheck suchen</label>
    </FloatLabel>
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="submissions.length === 0">
      <p class="font-lg font-bold m-5">Keine Mobilitätschecks gefunden.</p>
    </div>
    <div v-else>
      <div v-for="submission in filteredSubmissions" :key="submission.id">
        <MobilitySubmissionListItem
          :item="submission"
          @publish-item="onPublish"
          @copy-item="onCopy"
          @delete-item="onDelete"
          @export-item="onExport"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { copyItem, deleteItem, exportItem, fetchItems, updateItem } from '@/composables/crud'
import MobilitySubmissionListItem from '@/components/history/MobilitySubmissionListItem.vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const props = defineProps({
  filter: Object
})

const isLoading = ref(false)
const submissions = ref([])
const searchQuery = ref('')

const fetchSubmissions = async () => {
  isLoading.value = true
  submissions.value = await fetchItems('submission/mobility/by-params', props.filter)
  isLoading.value = false
}

onMounted(async () => {
  await fetchSubmissions()
})

// Computed property to filter submissions by multiple fields
const filteredSubmissions = computed(() => {
  return submissions.value.filter((submission) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results =
      submission.label.toLowerCase().includes(query) ||
      submission.author.toLowerCase().includes(query) ||
      submission.administrationNo.toLowerCase().includes(query) ||
      submission.administrationDate.includes(query) ||
      submission.desc.toLowerCase().includes(query) ||
      submission.createdAt.includes(query) // Date format remains the same, no need to lowercase
    isLoading.value = false
    return results
  })
})

const onPublish = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'submission/mobility',
    modelId,
    values,
    detail: {
      success: values.isPublished
        ? 'Mobilitätscheck veröffentlicht'
        : 'Veröffentlichung zurückgezogen',
      error: 'Fehler beim Veröffentlichen des Mobilitätschecks'
    }
  })
  const index = submissions.value.findIndex((submission) => submission.id === modelId)
  submissions.value[index].isPublished = response.isPublished
}

const onCopy = async (modelId) => {
  const response = await copyItem({
    model: 'mobility',
    modelId,
    detail: {
      success: 'Mobilitätscheck erfolgreich kopiert',
      error: 'Fehler beim Kopieren des Mobilitätschecks'
    }
  })
  submissions.value.unshift(response)
}

const onDelete = async (modelId) => {
  await deleteItem({
    model: 'submission/mobility',
    modelId,
    detail: {
      success: 'Mobilitätscheck erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Mobilitätschecks'
    }
  })
  const index = submissions.value.findIndex((submission) => submission.id === modelId)
  submissions.value.splice(index, 1)
}

const onExport = async (modelId) => {
  await exportItem({
    model: 'mobility',
    modelId,
    detail: {
      success: 'Mobilitätscheck erfolgreich exportiert',
      error: 'Fehler beim Exportieren des Mobilitätschecks'
    }
  })
}
</script>

<style scoped>
/* Add your styling here */
</style>
