<template>
  <div>
    <!-- Display list of submissions -->

    <BaseCard :collapseable="true" :isCollapsed="isCollapsed">
      <template #title>
        <h2 class="font-bold text-lg mb-4 flex" @click="expandCollapse">
          <IconAdd /><span>Neuen Tag hinzufügen</span>
        </h2>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-5 gap-x-2">
          <div class="col-span-4">
            <InputText
              v-model="newTag.label"
              placeholder="Tag eingeben"
              class="w-full"
              required="true"
            />
          </div>
          <ButtonSave type="submit" color="green" class="w-36" />
        </div>
      </form>
    </BaseCard>

    <InputText v-model="searchQuery" placeholder="Nach Tag suchen" class="w-full mt-5" />
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="tags.length === 0">
      <p class="font-lg font-bold m-5">Keine Indikatoren vorhanden.</p>
    </div>
    <div v-else>
      <BaseCard v-for="(tag, ix) in filteredTags" :key="tag.id">
        <div v-if="!itemEditMode[ix]">
          <div class="grid grid-cols-5 gap-x-2">
            <div class="col-span-3">
              <h3 class="mb-2">{{ tag.label }}</h3>
            </div>
            <ButtonBearbeiten @click="editTag(tag, ix)" class="w-36" />
            <ButtonLoeschen @click="deleteTag(tag.id, ix)" class="w-36" />
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="onUpdateSUbmit(ix)">
            <div class="grid grid-cols-5 gap-x-2">
              <div class="col-span-3">
                <InputText
                  v-model="currentTag.label"
                  placeholder="Tag eingeben"
                  class="w-full"
                  required="true"
                />
              </div>
              <ButtonAbbrechen @click="cancelEdit()" color="red" class="w-36" />
              <ButtonSave type="submit" color="green" class="w-36" />
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
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import ButtonAbbrechen from '@/components/ui/ButtonAbbrechen.vue'
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const toast = useToast()
const isLoading = ref(false)
const isCollapsed = ref(true)
const tags = ref([])
const currentTag = ref({
  label: '',
  id: null,
  ix: null
})
const newTag = ref({
  label: ''
})
const searchQuery = ref('')

onMounted(async () => {
  await fetchTags()
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
  itemEditMode.value = Array(tags.value.length).fill(false)
}

const resetCurrentTag = () => {
  currentTag.value = {
    label: '',
    ix: null,
    id: null
  }
}

const resetNewTag = () => {
  newTag.value.label = ''
}

const fetchTags = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/tag')
    tags.value = response.data
  } catch (error) {
    tags.value = []
  }
  isLoading.value = false
}

const deleteTag = async (id, ix) => {
  const response = await apiClient.delete(`/tag/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Tag erfolgreich gelöscht',
        life: 3000
      })
      tags.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Tags',
        life: 3000
      })
  }
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

const onUpdateSUbmit = async (ix) => {
  try {
    const response = await apiClient.patch(`/tag/${currentTag.value.id}`, currentTag.value)
    switch (response.status) {
      case 200:
        toast.add({
          severity: 'success',
          summary: 'Tag erfolgreich aktualisiert',
          life: 3000
        })
        tags.value.splice(ix, 1, response.data)
        resetCurrentTag()
        setItemEditMode(ix)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des Tags',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Aktualisieren des Tags',
      life: 3000
    })
  }
}

const onSubmit = async () => {
  try {
    const response = await apiClient.post('/tag', newTag.value)
    switch (response.status) {
      case 201:
        toast.add({
          severity: 'success',
          summary: 'Tag erfolgreich hinzugefügt',
          life: 3000
        })
        tags.value.unshift(response.data)
        itemEditMode.value.unshift(false)
        resetNewTag()
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Hinzufügen des Tags',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Hinzufügen des Tags',
      life: 3000
    })
  }
}

const editTag = async (tag, ix) => {
  if (currentTag.value.ix !== null) {
    setItemEditMode(currentTag.value.ix)
  }
  currentTag.value = { ...tag }
  currentTag.value.ix = ix
  setItemEditMode(ix)
}

const cancelEdit = () => {
  setItemEditMode(currentTag.value.ix)
  resetCurrentTag()
}
</script>

<style scoped>
/* Add your styling here */
</style>
