<template>
  <div>
    <!-- Display list of submissions -->

    <BaseModal v-model="isModalOpen" @close="toggleModal">
      <template #header>
        <h2>Leitziel hinzufügen</h2>
      </template>
      <MainObjectiveForm :editMode="false" :nextNo="nextNo" @add-item="onSubmit" />
    </BaseModal>
    <ButtonAdd @click="toggleModal" class="my-5">Leitziel hinzufügen</ButtonAdd>
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Leitziel suchen</label>
    </FloatLabel>
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="mainObjectives.length === 0">
      <p class="font-lg font-bold m-5">Keine Leitziele vorhanden.</p>
    </div>
    <div v-else>
      <div v-for="mainObjective in filteredMainObjetives" :key="mainObjective.id">
        <MainObjectiveSettingsItem
          :item="mainObjective"
          @delete-item="onDelete"
          @update-item="onUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { createItem, fetchItems, updateItem, deleteItem } from '@/composables/crud'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import MainObjectiveForm from './MainObjectiveForm.vue'
import MainObjectiveSettingsItem from './MainObjectiveSettingsItem.vue'
import ButtonAdd from '@/components/ui/ButtonAdd.vue'

const isLoading = ref(false)
const isModalOpen = ref(false)
const mainObjectives = ref([])

const searchQuery = ref('')

onMounted(async () => {
  await fetchMainObjetives()
})

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const fetchMainObjetives = async () => {
  isLoading.value = true
  mainObjectives.value = await fetchItems('/objective/main')
  isLoading.value = false
}

const onDelete = async (id) => {
  await deleteItem({
    model: 'objective/main',
    modelId: id,
    detail: {
      success: 'Leitziel erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Leitziels'
    }
  })
  const ix = mainObjectives.value.findIndex((objective) => objective.id === id)
  if (ix !== -1) {
    mainObjectives.value.splice(ix, 1)
  }
}

// Computed property to filter submissions by multiple fields
const filteredMainObjetives = computed(() => {
  return mainObjectives.value.filter((mainObjective) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results = mainObjective.label.toLowerCase().includes(query)

    isLoading.value = false
    return results
  })
})

const nextNo = computed(() => {
  return mainObjectives.value.length + 1
})

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'objective/main',
    modelId,
    values,
    detail: {
      success: 'Leitziel erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Leitziels'
    }
  })
  const ix = mainObjectives.value.findIndex((objective) => objective.id === response.id)
  if (ix !== -1) {
    mainObjectives.value.splice(ix, 1, response)
  }
}

const onSubmit = async (values) => {
  const response = await createItem({
    model: 'objective/main',
    values: values,
    detail: {
      success: 'Leitziel erfolgreich hinzugefügt',
      error: 'Fehler beim Hinzufügen des Leitziels'
    }
  })
  mainObjectives.value.unshift(response)
}
</script>

<style scoped>
/* Add your styling here */
</style>
