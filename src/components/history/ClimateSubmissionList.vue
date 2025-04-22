<template>
  <div class="my-5">
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Klimacheck suchen</label>
    </FloatLabel>
    <!-- Display list of submissions -->
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="submissions.length === 0">
      <p class="font-lg font-bold m-5">Keine Klimachecks gefunden.</p>
    </div>
    <div v-else>
      <div v-for="submission in filteredSubmissions" :key="submission.id">
        <ClimateSubmissionListItem
          :item="submission"
          @update-item="onUpdate"
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
import ClimateSubmissionListItem from '@/components/history/ClimateSubmissionListItem.vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

const props = defineProps({
  filter: Object
})

const submissions = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  await fetchSubmissions()
})

const fetchSubmissions = async () => {
  isLoading.value = true
  submissions.value = await fetchItems('submission/climate/by-params', props.filter)
  isLoading.value = false
}

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
      submission.createdAt.includes(query) // Date format remains the same, no need to lowercase
    isLoading.value = false
    return results
  })
})

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'submission/climate',
    modelId,
    values,
    detail: {
      success: 'Klimacheck erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Klimachecks'
    }
  })
  const index = submissions.value.findIndex((submission) => submission.id === modelId)
  submissions.value[index] = response
}

const onPublish = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'submission/climate',
    modelId,
    values,
    detail: {
      success: values.isPublished ? 'Klimacheck veröffentlicht' : 'Veröffentlichung zurückgezogen',
      error: 'Fehler beim Veröffentlichen des Klimachecks'
    }
  })
  const index = submissions.value.findIndex((submission) => submission.id === modelId)
  submissions.value[index] = response
}

const onCopy = async (modelId) => {
  const response = await copyItem({
    model: 'climate',
    modelId,
    detail: {
      success: 'Klimacheck erfolgreich kopiert',
      error: 'Fehler beim Kopieren des Klimachecks'
    }
  })
  submissions.value.unshift(response)
}

const onDelete = async (modelId) => {
  await deleteItem({
    model: 'submission/climate',
    modelId,
    detail: {
      success: 'Klimacheck erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Klimachecks'
    }
  })
  const index = submissions.value.findIndex((submission) => submission.id === modelId)
  submissions.value.splice(index, 1)
}

const onExport = async (modelId) => {
  await exportItem({
    model: 'climate',
    modelId,
    detail: {
      success: 'Klimacheck erfolgreich exportiert',
      error: 'Fehler beim Exportieren des Klimachecks'
    }
  })
}
</script>

<style scoped>
/* Add your styling here */
</style>
