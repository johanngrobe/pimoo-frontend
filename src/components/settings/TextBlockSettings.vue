<template>
  <div>
    <PrimeToast position="top-center" />
    <!-- Display list of submissions -->

    <BaseCard :collapseable="true" :isCollapsed="isCollapsed">
      <template #title>
        <h2 class="font-bold text-lg mb-4 flex" @click="expandCollapse">
          <IconAdd /><span>Neuen Textblock hinzufügen</span>
        </h2>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-5 gap-x-2">
          <div class="col-span-4">
            <InputText
              v-model="newTextBlock.label"
              placeholder="Textblock eingeben"
              class="w-full"
              required="true"
            />
            <MultiSelect
              v-model="newTextBlock.tagIds"
              :options="tags"
              option-label="label"
              option-value="id"
              display="chip"
              placeholder="Tags auswählen"
              class="w-full mt-2"
            />
          </div>
          <BaseButton type="submit" color="green" class="w-36"
            ><IconSave class="me-1" height="20" />
            <span class="text-left w-18">Hinzufügen</span></BaseButton
          >
        </div>
      </form>
    </BaseCard>

    <InputText v-model="searchQuery" placeholder="Nach Maßnahme suchen" class="w-full mt-5" />
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="textBlocks.length === 0">
      <p class="font-lg font-bold m-5">Keine Textblöcke vorhanden.</p>
    </div>
    <div v-else>
      <BaseCard v-for="(textBlock, ix) in filteredTextBlocks" :key="textBlock.id">
        <div v-if="!itemEditMode[ix]">
          <div class="grid grid-cols-5 gap-x-2">
            <div class="col-span-4">
              <h3 class="mb-2">{{ textBlock.label }}</h3>
              <div class="flex">
                <span class="font-semibold me-2">Tags:</span>
                <div v-if="textBlock.tags.length > 0">
                  <span
                    v-for="tag in textBlock.tags"
                    :key="tag.id"
                    class="px-2 py-1 mx-1 rounded-2xl bg-gray-200"
                    >{{ tag.label }}</span
                  >
                </div>
                <div v-else>
                  <span class="bg-red-600 text-white rounded-2xl px-2 py-1"
                    >Keine Tags vergeben</span
                  >
                </div>
              </div>
            </div>
            <div>
              <BaseButton @click="editTextBlock(textBlock, ix)" class="w-36">
                <IconEdit class="me-1" height="20" /><span class="text-left w-18"
                  >Bearbeiten</span
                ></BaseButton
              >
              <!-- Edit form (appears when editing) -->
              <BaseButton @click="deleteTextBlock(textBlock.id, ix)" color="red" class="w-36"
                ><IconDelete class="me-1" height="20" />
                <span class="text-left w-18">Löschen</span></BaseButton
              >
            </div>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="onUpdateSUbmit(ix)">
            <div class="grid grid-cols-5 gap-x-2">
              <div class="col-span-4">
                <InputText
                  v-model="currentTextBlock.label"
                  placeholder="Textblock-Bezeichnung"
                  class="w-full"
                  required="true"
                />
                <MultiSelect
                  v-model="currentTextBlock.tagIds"
                  :options="tags"
                  option-label="label"
                  option-value="id"
                  display="chip"
                  placeholder="Tags auswählen"
                  class="w-full mt-2"
                />
              </div>
              <div>
                <BaseButton @click="cancelEdit()" color="red" class="w-36"
                  ><IconCancel class="me-1" height="20" />
                  <span class="text-left w-18">Abbrechen</span></BaseButton
                >
                <BaseButton type="submit" color="green" class="w-36"
                  ><IconSave class="me-1" height="20" />
                  <span class="text-left w-18">Speichern</span></BaseButton
                >
              </div>
            </div>
          </form>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import apiClient from '@/services/axios'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'
import IconSave from '@/assets/icons/MaterialSymbolsSave.svg?component'
import IconCancel from '@/assets/icons/MaterialSymbolsCancel.svg?component'
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const toast = useToast()
const isLoading = ref(false)
const isCollapsed = ref(true)
const textBlocks = ref([])
const tags = ref([])
const currentTextBlock = ref({
  label: '',
  tags: [],
  tagIds: [],
  id: null
})
const newTextBlock = ref({
  label: '',
  tagIds: []
})
const searchQuery = ref('')

onMounted(async () => {
  await fetchTextBlocks()
  await fetchTags()
  setItemEditArray()
})

const expandCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const setItemEditMode = (ix) => {
  itemEditMode.value[ix] = !itemEditMode.value[ix]
}

const itemEditMode = ref([])

const setItemEditArray = () => {
  itemEditMode.value = Array(textBlocks.value.length).fill(false)
}

const resetCurrentTextBlock = () => {
  currentTextBlock.value = {
    label: '',
    tags: [],
    tagIds: [],
    ix: null,
    id: null
  }
}

const resetNewTextBlock = () => {
  newTextBlock.value = {
    label: '',
    tagIds: []
  }
}

const fetchTextBlocks = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/text-block')
    textBlocks.value = response.data
    isLoading.value = false
  } catch (error) {
    textBlocks.value = []
  }
}

const fetchTags = async () => {
  try {
    const response = await apiClient.get('/tag')
    tags.value = response.data
  } catch (error) {
    tags.value = []
  }
}

const deleteTextBlock = async (id, ix) => {
  const response = await apiClient.delete(`/text-block/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Textblock erfolgreich gelöscht',
        life: 3000
      })
      textBlocks.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Textblocks',
        life: 3000
      })
  }
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

const getTagIds = () => {
  currentTextBlock.value.tagIds = currentTextBlock.value.tags.map((tag) => tag.id)
}

const onUpdateSUbmit = async (ix) => {
  try {
    const response = await apiClient.put(
      `/text-block/${currentTextBlock.value.id}`,
      currentTextBlock.value
    )
    switch (response.status) {
      case 200:
        toast.add({
          severity: 'success',
          summary: 'Textblock erfolgreich aktualisiert',
          life: 3000
        })
        textBlocks.value.splice(ix, 1, response.data)
        resetCurrentTextBlock()
        setItemEditMode(ix)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des Textblocks',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Aktualisieren des Textblocks',
      life: 3000
    })
  }
}

const onSubmit = async () => {
  try {
    const response = await apiClient.post('/text-block', newTextBlock.value)
    switch (response.status) {
      case 201:
        toast.add({
          severity: 'success',
          summary: 'Textblock erfolgreich hinzugefügt',
          life: 3000
        })
        textBlocks.value.unshift(response.data)
        itemEditMode.value.unshift(false)
        resetNewTextBlock()
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Hinzufügen des Textblocks',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Hinzufügen des Textblocks',
      life: 3000
    })
  }
}

const editTextBlock = async (textBlock, ix) => {
  if (currentTextBlock.value.ix !== null) {
    setItemEditMode(currentTextBlock.value.ix)
  }
  currentTextBlock.value = { ...textBlock }
  currentTextBlock.value.ix = ix
  getTagIds()
  setItemEditMode(ix)
  await fetchTags()
}

const cancelEdit = () => {
  setItemEditMode(currentTextBlock.value.ix)
  resetCurrentTextBlock()
}
</script>

<style scoped>
/* Add your styling here */
</style>
