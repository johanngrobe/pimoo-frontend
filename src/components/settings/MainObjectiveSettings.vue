<template>
  <div>
    <PrimeToast position="top-center" />
    <!-- Display list of submissions -->

    <BaseCard :collapseable="true" :isCollapsed="isCollapsed">
      <template #title>
        <h2 class="font-bold text-lg mb-4 flex" @click="expandCollapse">
          <IconAdd /><span>Neues Leitziel hinzufügen</span>
        </h2>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-5 gap-x-2">
          <div class="col-span-4">
            <div class="flex">
              <InputNumber
                v-model="newMainObjective.no"
                placeholder="#"
                class="w-16 me-2"
                inputClass="w-16"
                locale="de-DE"
                :min="1"
                :step="1"
                required="true"
              />
              <InputText
                v-model="newMainObjective.label"
                placeholder="Indikator eingeben"
                class="w-full"
                required="true"
              />
            </div>
          </div>
          <BaseButton type="submit" color="green" class="w-36"
            ><IconSave class="me-1" height="20" />
            <span class="text-left w-18">Hinzufügen</span></BaseButton
          >
        </div>
      </form>
    </BaseCard>

    <InputText v-model="searchQuery" placeholder="Nach Leitziel suchen" class="w-full mt-5" />
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="mainObjectives.length === 0">
      <p class="font-lg font-bold m-5">Keine Leitziele vorhanden.</p>
    </div>
    <div v-else>
      <BaseCard v-for="(mainObjective, ix) in filteredMainObjetives" :key="mainObjective.id">
        <div v-if="!itemEditMode[ix]">
          <div class="grid grid-cols-5 gap-x-2">
            <div class="col-span-4 flex">
              <div class="w-10">{{ mainObjective.no }}</div>
              <div class="me-4">{{ mainObjective.label }}</div>
            </div>
            <div>
              <BaseButton @click="editMainObjective(mainObjective, ix)" class="w-36">
                <IconEdit class="me-1" height="20" /><span class="text-left w-18"
                  >Bearbeiten</span
                ></BaseButton
              >
              <!-- Edit form (appears when editing) -->
              <BaseButton
                @click="deleteMainObjective(mainObjective.id, ix)"
                color="red"
                class="w-36"
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
                <div class="flex">
                  <InputNumber
                    v-model="currentMainObjective.no"
                    placeholder="#"
                    class="w-16"
                    inputClass="w-16"
                    locale="de-DE"
                    :min="1"
                    :step="1"
                    required="true"
                  />
                  <InputText
                    v-model="currentMainObjective.label"
                    placeholder="Name des Leitziels"
                    class="w-full"
                    required="true"
                  />
                </div>
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
import InputNumber from 'primevue/inputnumber'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'
import IconSave from '@/assets/icons/MaterialSymbolsSave.svg?component'
import IconCancel from '@/assets/icons/MaterialSymbolsCancel.svg?component'
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const toast = useToast()
const isLoading = ref(false)
const isCollapsed = ref(true)
const mainObjectives = ref([])
const currentMainObjective = ref({
  label: '',
  no: null,
  ix: null,
  id: null
})
const newMainObjective = ref({
  label: '',
  no: null
})
const searchQuery = ref('')

onMounted(async () => {
  await fetchMainObjetives()
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
  itemEditMode.value = Array(mainObjectives.value.length).fill(false)
}

const resetCurrentMainObjective = () => {
  currentMainObjective.value = {
    label: '',
    no: null,
    ix: null,
    id: null
  }
}

const resetNewMainObjective = () => {
  newMainObjective.value = {
    label: '',
    no: null
  }
}

const fetchMainObjetives = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/objective/main')
    mainObjectives.value = response.data
  } catch (error) {
    mainObjectives.value = []
  }
  isLoading.value = false
}

const deleteMainObjective = async (id, ix) => {
  const response = await apiClient.delete(`/objective/main/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Leitziel erfolgreich gelöscht',
        life: 3000
      })
      mainObjectives.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Leitziels',
        life: 3000
      })
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

const onUpdateSUbmit = async (ix) => {
  try {
    const response = await apiClient.put(
      `/objective/main/${currentMainObjective.value.id}`,
      currentMainObjective.value
    )
    switch (response.status) {
      case 200:
        toast.add({
          severity: 'success',
          summary: 'Leitziel erfolgreich aktualisiert',
          life: 3000
        })
        mainObjectives.value.splice(ix, 1, response.data)
        resetCurrentMainObjective()
        setItemEditMode(ix)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des Leitziels',
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

const onSubmit = async () => {
  try {
    const response = await apiClient.post('/objective/main', newMainObjective.value)
    switch (response.status) {
      case 201:
        toast.add({
          severity: 'success',
          summary: 'Leitziel erfolgreich hinzugefügt',
          life: 3000
        })
        mainObjectives.value.unshift(response.data)
        itemEditMode.value.unshift(false)
        resetNewMainObjective()
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Hinzufügen des Leitziels',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Hinzufügen des Leitziels',
      life: 3000
    })
  }
}

const editMainObjective = async (mainObjective, ix) => {
  if (currentMainObjective.value.ix !== null) {
    setItemEditMode(currentMainObjective.value.ix)
  }
  currentMainObjective.value = { ...mainObjective }
  currentMainObjective.value.ix = ix
  setItemEditMode(ix)
}

const cancelEdit = () => {
  setItemEditMode(currentMainObjective.value.ix)
  resetCurrentMainObjective()
}
</script>

<style scoped>
/* Add your styling here */
</style>
