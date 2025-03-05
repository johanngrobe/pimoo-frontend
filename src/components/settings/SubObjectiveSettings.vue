<template>
  <div>
    <!-- Display list of submissions -->
    <BaseCard :collapseable="true" :isCollapsed="isCollapsed">
      <template #title>
        <h2 class="font-bold text-lg mb-4 flex" @click="expandCollapse">
          <IconAdd /><span>Neues Unterziel hinzufügen</span>
        </h2>
      </template>
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-5 gap-x-2">
          <div class="col-span-4">
            <div class="flex">
              <Dropdown
                v-model="newSubObjective.mainObjective"
                :options="mainObjectives"
                optionLabel="label"
                placeholder="Leitziel"
                class="w-16 me-2"
                id="mainObjectiveId"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex align-items-center">
                    <div class="me-2">{{ slotProps.value.no }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <div class="me-2">{{ slotProps.option.no }}</div>
                    <div>{{ slotProps.option.label }}</div>
                  </div>
                </template></Dropdown
              >
              <InputNumber
                v-model="newSubObjective.no"
                placeholder="#"
                class="w-16 me-2"
                inputClass="w-16"
                locale="de-DE"
                :min="1"
                :step="1"
                required="true"
              />
              <InputText
                v-model="newSubObjective.label"
                placeholder="Indikator eingeben"
                class="w-full"
                required="true"
              />
            </div>
          </div>
          <ButtonSave type="submit" color="green" class="w-36" />
        </div>
      </form>
    </BaseCard>

    <InputText v-model="searchQuery" placeholder="Nach Leitziel suchen" class="w-full mt-5" />
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="subObjectives.length === 0">
      <p class="font-lg font-bold m-5">Keine Unterziele vorhanden.</p>
    </div>
    <div v-else>
      <div v-for="(subObjective, ix) in filteredSubObjetives" :key="subObjective.id">
        <!-- <div v-if="showMainObjective" class="font-bold mt-4">
          {{ subObjective.mainObjective.no }} {{ subObjective.mainObjective.label }}
        </div> -->
        <BaseCard>
          <div v-if="!itemEditMode[ix]">
            <div class="grid grid-cols-5 gap-x-2">
              <div class="col-span-4">
                <div class="flex">
                  <div class="w-10 font-bold">
                    {{ subObjective.mainObjective.no }}.{{ subObjective.no }}
                  </div>
                  <div class="me-4 font-bold">{{ subObjective.label }}</div>
                </div>
                <div class="mt-5">
                  <span class="font-bold me-2">Leitziel:</span>
                  <span class="me-1">{{ subObjective.mainObjective.no }}</span>
                  {{ subObjective.mainObjective.label }}
                </div>
              </div>
              <div>
                <ButtonBearbeiten @click="editSubObjective(subObjective, ix)" class="w-36" />
                <ButtonLoeschen @click="deleteSubObjective(subObjective.id, ix)" class="w-36" />
              </div>
            </div>
          </div>
          <div v-else>
            <form @submit.prevent="onUpdateSUbmit(ix)">
              <div class="grid grid-cols-5 gap-x-2">
                <div class="col-span-4">
                  <div class="flex">
                    <Dropdown
                      v-model="currentSubObjective.mainObjective"
                      :options="mainObjectives"
                      optionLabel="label"
                      placeholder="Leitziel"
                      class="w-16 me-2"
                      id="mainObjectiveId"
                    >
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex align-items-center">
                          <div class="me-2">{{ slotProps.value.no }}</div>
                        </div>
                        <span v-else>
                          {{ slotProps.placeholder }}
                        </span>
                      </template>
                      <template #option="slotProps">
                        <div class="flex align-items-center">
                          <div class="me-2">{{ slotProps.option.no }}</div>
                          <div>{{ slotProps.option.label }}</div>
                        </div>
                      </template></Dropdown
                    >
                    <InputNumber
                      v-model="currentSubObjective.no"
                      placeholder="#"
                      class="w-16"
                      inputClass="w-16"
                      locale="de-DE"
                      :min="1"
                      :step="1"
                      required="true"
                    />
                    <InputText
                      v-model="currentSubObjective.label"
                      placeholder="Name des Leitziels"
                      class="w-full"
                      required="true"
                    />
                  </div>
                </div>
                <div>
                  <ButtonAbbrechen @click="cancelEdit()" class="w-36" />
                  <ButtonSave type="submit" color="green" class="w-36" />
                </div>
              </div>
            </form>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import apiClient from '@/services/axios'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import ButtonLoeschen from '@/components/ui/ButtonLoeschen.vue'
import ButtonBearbeiten from '@/components/ui/ButtonBearbeiten.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import ButtonAbbrechen from '@/components/ui/ButtonAbbrechen.vue'
import IconAdd from '@/assets/icons/MaterialSymbolsAdd.svg?component'

const toast = useToast()
const isLoading = ref(false)
const isCollapsed = ref(true)
const subObjectives = ref([])
const currentSubObjective = ref({
  label: '',
  no: null,
  ix: null,
  id: null,
  mainObjectiveId: null,
  mainObjective: null
})
const newSubObjective = ref({
  label: '',
  no: null,
  mainObjectiveId: null,
  mainObjective: {}
})

newSubObjective.value.mainObjectiveId = computed(() => {
  return newSubObjective.value?.mainObjective?.id || null
})

const searchQuery = ref('')

onMounted(async () => {
  await fetchSubObjetives()
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
  itemEditMode.value = Array(subObjectives.value.length).fill(false)
}

const resetCurrentSubObjective = () => {
  currentSubObjective.value = {
    label: '',
    mainObjectiveId: null,
    mainObjective: null,
    no: null,
    ix: null,
    id: null
  }
}

const resetNewSubObjective = () => {
  newSubObjective.value = {
    label: '',
    no: null,
    mainObjectiveId: null,
    mainObjective: null
  }
}

const fetchSubObjetives = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/objective/sub')
    subObjectives.value = response.data
  } catch (error) {
    subObjectives.value = []
  }
  isLoading.value = false
}

const mainObjectives = ref([])

const fetchMainObjetives = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/objective/main')
    mainObjectives.value = response.data.map((mainObjective) => {
      return {
        ...mainObjective,
        labelShown: false
      }
    })
  } catch (error) {
    mainObjectives.value = []
  }
  isLoading.value = false
}

const deleteSubObjective = async (id, ix) => {
  const response = await apiClient.delete(`/objective/sub/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Unterziel erfolgreich gelöscht',
        life: 3000
      })
      subObjectives.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Unterziel',
        life: 3000
      })
  }
}

// Computed property to filter submissions by multiple fields
const filteredSubObjetives = computed(() => {
  return subObjectives.value.filter((subObjective) => {
    const query = searchQuery.value.toLowerCase()
    isLoading.value = true
    let results = subObjective.label.toLowerCase().includes(query)

    isLoading.value = false
    return results
  })
})

const onUpdateSUbmit = async (ix) => {
  try {
    const response = await apiClient.patch(
      `/objective/sub/${currentSubObjective.value.id}`,
      currentSubObjective.value
    )
    switch (response.status) {
      case 200:
        toast.add({
          severity: 'success',
          summary: 'Unterziel erfolgreich aktualisiert',
          life: 3000
        })
        subObjectives.value.splice(ix, 1, response.data)
        resetCurrentSubObjective()
        setItemEditMode(ix)
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des Unterziels',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Aktualisieren des Unterziels',
      life: 3000
    })
  }
}

const onSubmit = async () => {
  try {
    const response = await apiClient.post('/objective/sub', newSubObjective.value)
    switch (response.status) {
      case 201:
        toast.add({
          severity: 'success',
          summary: 'Unterziel erfolgreich hinzugefügt',
          life: 3000
        })
        subObjectives.value.unshift(response.data)
        itemEditMode.value.unshift(false)
        resetNewSubObjective()
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Hinzufügen des Unterziels',
          life: 3000
        })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Hinzufügen des Unterziels',
      life: 3000
    })
  }
}

const editSubObjective = async (subObjective, ix) => {
  if (currentSubObjective.value.ix !== null) {
    setItemEditMode(currentSubObjective.value.ix)
  }
  currentSubObjective.value = { ...subObjective }
  currentSubObjective.value.ix = ix
  setItemEditMode(ix)
}

const cancelEdit = () => {
  setItemEditMode(currentSubObjective.value.ix)
  resetCurrentSubObjective()
}
</script>

<style scoped>
/* Add your styling here */
</style>
