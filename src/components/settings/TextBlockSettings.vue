<template>
  <div>
    <!-- Display list of submissions -->

    <BaseModal v-model="isModalOpen" @close="toggleModal">
      <template #header>
        <h2>Textblock hinzufügen</h2>
      </template>
      <TextBlockForm :editMode="false" :tags="tags" @add-item="onSubmit" />
    </BaseModal>
    <ButtonAdd @click="toggleModal" class="my-5">Textblock hinzufügen</ButtonAdd>
    <FloatLabel variant="on">
      <InputText id="searchQuery" v-model="searchQuery" class="w-full" />
      <label for="searchQuery">Nach Textblock suchen</label>
    </FloatLabel>
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="textBlocks.length === 0">
      <p class="font-lg font-bold m-5">Keine Textblöcke vorhanden.</p>
    </div>
    <div v-else>
      <div v-for="textBlock in filteredTextBlocks" :key="textBlock.id">
        <TextBlockSettingsItem
          :item="textBlock"
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
import { fetchItems, deleteItem, createItem, updateItem } from '@/composables/crud'
import TextBlockForm from '@/components/settings/TextBlockForm.vue'
import TextBlockSettingsItem from '@/components/settings/TextBlockSettingsItem.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ButtonAdd from '@/components/ui/ButtonAdd.vue'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'

const isLoading = ref(false)
const isModalOpen = ref(false)
const textBlocks = ref([])
const tags = ref([])

const searchQuery = ref('')

onMounted(async () => {
  await fetchTextBlocks()
  await fetchTags()
})

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const fetchTextBlocks = async () => {
  isLoading.value = true
  textBlocks.value = await fetchItems('/text-block')
  isLoading.value = false
}

const fetchTags = async () => {
  tags.value = await fetchItems('/tag')
}

// Computed property to filter submissions by multiple fields
const filteredTextBlocks = computed(() => {
  return textBlocks.value.filter((textBlock) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results = textBlock.label.toLowerCase().includes(query)

    isLoading.value = false
    return results
  })
})

const onDelete = async (modelId) => {
  await deleteItem({
    model: 'text-block',
    modelId,
    detail: {
      success: 'Textblock erfolgreich gelöscht',
      error: 'Fehler beim Löschen des Textblocks'
    }
  })
  const ix = textBlocks.value.findIndex((item) => item.id === modelId)
  if (ix !== -1) {
    textBlocks.value.splice(ix, 1)
  }
}

const onUpdate = async ({ modelId, values }) => {
  const response = await updateItem({
    model: 'text-block',
    modelId,
    values,
    detail: {
      success: 'Textblock erfolgreich aktualisiert',
      error: 'Fehler beim Aktualisieren des Textblock'
    }
  })
  const ix = textBlocks.value.findIndex((item) => item.id === response.id)
  if (ix !== -1) {
    textBlocks.value.splice(ix, 1, response)
  }
}

const onSubmit = async (values) => {
  const response = await createItem({
    model: 'text-block',
    values,
    detail: {
      success: 'Textblock erfolgreich hinzugefügt',
      error: 'Fehler beim Hinzufügen des Textblock'
    }
  })
  textBlocks.value.unshift(response)
}
</script>

<style scoped>
/* Add your styling here */
</style>
