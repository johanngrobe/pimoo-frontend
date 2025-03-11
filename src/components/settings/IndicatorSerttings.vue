<template>
  <div>
    <!-- Display list of submissions -->

    <BaseModal v-model="isModalOpen" @close="toggleModal">
      <template #header>
        <h2>Indikator hinzufügen</h2>
      </template>
      <IndicatorForm :editMode="false" :tags="tags" @add-item="onSubmit" />
    </BaseModal>
    <ButtonAdd @click="toggleModal" class="my-5">Indikator hinzufügen</ButtonAdd>
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Indikator suchen</label>
    </FloatLabel>
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="indicators.length === 0">
      <p class="font-lg font-bold m-5">Keine Indikatoren vorhanden.</p>
    </div>
    <div v-else>
      <div v-for="indicator in filteredIndicators" :key="indicator.id">
        <IndicatorSettingsItem
          :item="indicator"
          :tags="tags"
          @delete-item="onDelete"
          @update-item="onUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { createItem, deleteItem, fetchItems, updateItem } from '@/composables/crud'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import IndicatorForm from '@/components/settings/IndicatorForm.vue'
import ButtonAdd from '@/components/ui/ButtonAdd.vue'
import IndicatorSettingsItem from '@/components/settings/IndicatorSettingsItem.vue'

const isLoading = ref(false)
const isModalOpen = ref(false)
const indicators = ref([])
const tags = ref([])
const searchQuery = ref('')

onMounted(async () => {
  await fetchIndicators()
  await fetchTags()
})

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const fetchIndicators = async () => {
  isLoading.value = true
  indicators.value = await fetchItems('/indicator')
  isLoading.value = false
}

const fetchTags = async () => {
  tags.value = await fetchItems('/tag')
}

// Computed property to filter submissions by multiple fields
const filteredIndicators = computed(() => {
  return indicators.value.filter((indicator) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results = indicator.label.toLowerCase().includes(query)

    isLoading.value = false
    return results
  })
})

const onDelete = async (modelId) => {
  await deleteItem({
    model: 'indicator',
    modelId,
    detail: {
      success: 'Indikator erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Indikators'
    }
  })
  const ix = indicators.value.findIndex((indicator) => indicator.id === modelId)
  if (ix !== -1) {
    indicators.value.splice(ix, 1)
  }
}

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'indicator',
    modelId,
    values,
    detail: {
      success: 'Indikator erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Indikators'
    }
  })
  const ix = indicators.value.findIndex((indicator) => indicator.id === modelId)
  if (ix !== -1) {
    indicators.value.splice(ix, 1, response)
  }
}

const onSubmit = async (values) => {
  const response = await createItem({
    model: 'indicator',
    values,
    detail: {
      success: 'Indikator erfolgreich hinzugefügt',
      error: 'Fehler beim Hinzufügen des Indikators'
    }
  })
  indicators.value.unshift(response)
  toggleModal()
}
</script>

<style scoped>
/* Add your styling here */
</style>
