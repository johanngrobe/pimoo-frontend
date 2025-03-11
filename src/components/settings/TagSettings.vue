<template>
  <div>
    <!-- Display list of submissions -->

    <BaseModal v-model="isModalOpen" @close="toggleModal">
      <template #header>
        <h2>Tag hinzufügen</h2>
      </template>
      <TagForm :editMode="false" @add-item="onSubmit" />
    </BaseModal>
    <ButtonAdd @click="toggleModal" class="my-5">Tag hinzufügen</ButtonAdd>
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Tag suchen</label>
    </FloatLabel>
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="tags.length === 0">
      <p class="font-lg font-bold m-5">Keine Indikatoren vorhanden.</p>
    </div>
    <div v-else>
      <div v-for="tag in filteredTags" :key="tag.id">
        <TagSettingsItem :item="tag" @delete-item="onDelete" @update-item="onUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { fetchItems, deleteItem, createItem, updateItem } from '@/composables/crud'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import TagForm from '@/components/settings/TagForm.vue'
import TagSettingsItem from '@/components/settings/TagSettingsItem.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ButtonAdd from '@/components/ui/ButtonAdd.vue'

const isLoading = ref(false)
const isModalOpen = ref(false)
const tags = ref([])
const searchQuery = ref('')

onMounted(async () => {
  await fetchTags()
})

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const fetchTags = async () => {
  isLoading.value = true
  tags.value = await fetchItems('/tag')
  isLoading.value = false
}

// Computed property to filter submissions by multiple fields
const filteredTags = computed(() => {
  return tags.value.filter((tag) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results = tag.label.toLowerCase().includes(query)

    isLoading.value = false
    return results
  })
})

const onDelete = async (modelId) => {
  await deleteItem({
    model: 'tag',
    modelId,
    detail: {
      success: 'Tag erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Tags'
    }
  })
  const ix = tags.value.findIndex((tag) => tag.id === modelId)
  if (ix !== -1) {
    tags.value.splice(ix, 1)
  }
}

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'tag',
    modelId,
    values,
    detail: {
      success: 'Tag erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Tags'
    }
  })
  const ix = tags.value.findIndex((tag) => tag.id === modelId)
  if (ix !== -1) {
    tags.value[ix] = response
  }
}

const onSubmit = async (values) => {
  const response = await createItem({
    model: 'tag',
    values,
    detail: {
      success: 'Tag erfolgreich hinzugefügt',
      error: 'Fehler beim Hinzufügen des Tags'
    }
  })
  tags.value.unshift(response)
  toggleModal()
}
</script>

<style scoped>
/* Add your styling here */
</style>
