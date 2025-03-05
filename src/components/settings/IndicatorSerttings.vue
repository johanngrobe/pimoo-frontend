<template>
  <div>
    <!-- Display list of submissions -->

    <BaseCard :collapseable="true" :isCollapsed="isCollapsed">
      <template #title>
        <h2 class="font-bold text-lg mb-4 flex" @click="expandCollapse">
          <IconAdd /><span>Neuen Inidikator hinzufügen</span>
        </h2>
        <IndicatorForm :tags="tags" @add-item="onSubmit" />
      </template>
    </BaseCard>

    <InputText v-model="searchQuery" placeholder="Nach Indikator suchen" class="w-full mt-5" />
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="indicators.length === 0">
      <p class="font-lg font-bold m-5">Keine Indikatoren vorhanden.</p>
    </div>
    <div v-else>
      <BaseCard v-for="(indicator, ix) in filteredIndicators" :key="indicator.id">
        <div v-if="!itemEditMode[ix]">
          <div class="grid grid-cols-5 gap-x-2">
            <div class="col-span-4">
              <h3 class="mb-2 me-2">
                <a v-if="indicator.sourceUrl" :href="indicator.sourceUrl" target="_blank">
                  <span class="text-blue-900 hover:underline">{{ indicator.label }}</span>
                  <span class="ms-2">🟩</span></a
                >
                <span v-else>{{ indicator.label }}<span class="ms-2">🟥</span></span>
              </h3>

              <div class="flex">
                <span class="font-semibold me-2">Tags:</span>
                <div v-if="indicator.tags.length > 0">
                  <span
                    v-for="tag in indicator.tags"
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
              <ButtonBearbeiten @click="editindicator(indicator, ix)" />
              <ButtonLoeschen @click="deleteindicator(indicator.id, ix)" color="red" />
            </div>
          </div>
        </div>
        <div v-else>
          <form @submit.prevent="onUpdateSUbmit(ix)">
            <div class="grid grid-cols-5 gap-x-2">
              <div class="col-span-4">
                <FloatLabel variant="on">
                  <InputText
                    id="label"
                    v-model.trim="currentIndicator.label"
                    class="w-full"
                    required="true"
                  />
                  <label for="label">Indikator-Bezeichnung</label>
                </FloatLabel>
                <FloatLabel varion="on">
                  <InputText
                    id="sourceUrl"
                    v-model.trim="currentIndicator.sourceUrl"
                    class="w-full mt-2"
                  />
                  <label for="sourceUrl">Quellen-URL</label>
                </FloatLabel>
                <div class="flex">
                  <FloatLabel variant="on">
                    <MultiSelect
                      v-model="currentIndicator.tagIds"
                      :options="tags"
                      option-label="label"
                      option-value="id"
                      id="tags"
                      display="chip"
                      class="w-full mt-2 ms-2"
                    />
                    <label for="tags">Tags</label>
                  </FloatLabel>
                </div>
              </div>
              <div>
                <ButtonAbbrechen @click="cancelEdit()" color="red" />
                <ButtonSave type="submit" color="green" />
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
import FloatLabel from 'primevue/floatlabel'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import ButtonAbbrechen from '@/components/ui/ButtonAbbrechen.vue'
import IndicatorForm from '@/components/settings/IndicatorForm.vue'
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const toast = useToast()
const isLoading = ref(false)
const isCollapsed = ref(true)
const indicators = ref([])
const tags = ref([])
const currentIndicator = ref({
  label: '',
  tags: [],
  tagIds: [],
  id: null,
  sourceUrl: null
})
const searchQuery = ref('')

onMounted(async () => {
  await fetchIndicators()
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
  itemEditMode.value = Array(indicators.value.length).fill(false)
}

const resetCurrentIndicator = () => {
  currentIndicator.value = {
    label: '',
    tags: [],
    tagIds: [],
    ix: null,
    id: null,
    sourceUrl: null
  }
}

const fetchIndicators = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/indicator')
    indicators.value = response.data
  } catch (error) {
    indicators.value = []
  }
  isLoading.value = false
}

const fetchTags = async () => {
  try {
    const response = await apiClient.get('/tag')
    tags.value = response.data
  } catch (error) {
    tags.value = []
  }
}

const deleteindicator = async (id, ix) => {
  const response = await apiClient.delete(`/indicator/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Indikator erfolgreich gelöscht',
        life: 3000
      })
      indicators.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Indikators',
        life: 3000
      })
  }
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

const getTagIds = () => {
  currentIndicator.value.tagIds = currentIndicator.value.tags.map((tag) => tag.id)
}

const onUpdateSUbmit = async (ix) => {
  try {
    const response = await apiClient.patch(
      `/indicator/${currentIndicator.value.id}`,
      currentIndicator.value
    )
    switch (response.status) {
      case 200:
        toast.add({
          severity: 'success',
          summary: 'indicator erfolgreich aktualisiert',
          life: 3000
        })
        indicators.value.splice(ix, 1, response.data)
        resetCurrentIndicator()
        setItemEditMode(ix)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des indicators',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Aktualisieren des indicators',
      life: 3000
    })
  }
}

const onSubmit = async (newIndicator) => {
  try {
    const response = await apiClient.post('/indicator', newIndicator)
    switch (response.status) {
      case 201:
        toast.add({
          severity: 'success',
          summary: 'indicator erfolgreich hinzugefügt',
          life: 3000
        })
        indicators.value.unshift(response.data)
        itemEditMode.value.unshift(false)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Hinzufügen des indicators',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Hinzufügen des indicators',
      life: 3000
    })
  }
}

const editindicator = async (indicator, ix) => {
  if (currentIndicator.value.ix !== null) {
    setItemEditMode(currentIndicator.value.ix)
  }
  currentIndicator.value = { ...indicator }
  currentIndicator.value.ix = ix
  getTagIds()
  setItemEditMode(ix)
  await fetchTags()
}

const cancelEdit = () => {
  setItemEditMode(currentIndicator.value.ix)
  resetCurrentIndicator()
}
</script>

<style scoped>
/* Add your styling here */
</style>
