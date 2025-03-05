<template>
  <div>
    <!-- Display list of submissions -->
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="submissions.length === 0">
      <p class="font-lg font-bold m-5">Keine Klimachecks gefunden.</p>
    </div>
    <div v-else>
      <InputText v-model="searchQuery" placeholder="Nach Maßnahme suchen" class="w-full mt-5" />
      <BaseCard v-for="submission in filteredSubmissions" :key="submission.id">
        <div class="flex justify-between">
          <div>
            <h3 class="font-bold text-lg mb-4">{{ submission.label }}</h3>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <span class="font-semibold">Sachbearbeitung:</span>
              <span>{{ submission.author.firstName }} {{ submission.author.lastName }}</span>
              <span v-if="checkLastEditor(submission)" class="font-semibold"
                >Letzte Bearbeitung durch:</span
              >
              <span v-if="checkLastEditor(submission)"
                >{{ submission.lastEditor.firstName }} {{ submission.lastEditor.lastName }}</span
              >
              <span class="font-semibold">Magistratvorlagennummer:</span>
              <span>{{ submission.administrationNo }}</span>
              <span class="font-semibold">Datum Magistratssitzung:</span>
              <span>{{ formatDate(submission.administrationDate) }}</span>
              <span class="font-semibold">Klimawirkung:</span>
              <span>{{ submission.impactLabel }}</span>
            </div>
          </div>
          <div class="flex space-x-4">
            <div class="grid grid-cols-1">
              <div class="mb-2" v-if="userRoleAccess()">
                <Checkbox
                  v-model="submission.isPublished"
                  :binary="true"
                  inputId="published"
                  class="ms-2"
                  @change="publishSubmission(submission.id, submission.isPublished)"
                />
                <label for="published" class="ms-2">Veröffentlicht</label>
              </div>
              <BaseButton @click="exportSubmission(submission.id)"
                ><IconDownload class="me-1" height="20" /><span class="text-left w-18"
                  >PDF-Export</span
                ></BaseButton
              >
              <BaseButton v-if="userRoleAccess()" @click="editSubmission(submission)">
                <IconEdit class="me-1" height="20" /><span class="text-left w-18"
                  >Bearbeiten</span
                ></BaseButton
              >
              <!-- Edit form (appears when editing) -->
              <BaseButton
                v-if="userRoleAccess()"
                @click="deleteSubmission(submission.id, ix)"
                color="red"
                ><IconDelete class="me-1" height="20" />
                <span class="text-left w-18 me-4">Löschen</span></BaseButton
              >
              <BaseButton
                v-if="userRoleAccess(['politician'])"
                @click="copySubmission(submission.id, ix)"
                color="green"
                ><IconEdit class="me-1" height="20" />
                <span class="text-left w-18 me-4">In meine Datenbank kopieren</span></BaseButton
              >
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    <BaseModal v-model="isEditing">
      <template #header>
        <h2>{{ currentSubmission.label }} bearbeiten</h2>
      </template>
      <BaseSpinner v-if="isLoading" class="m-10" />
      <ClimateSubmissionForm v-else v-model="currentSubmissionId" @close-modal="cancelEdit" />
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import apiClient from '@/services/axios'
import ClimateSubmissionForm from '@/components/form/ClimateForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'
import IconDownload from '@/assets/icons/MaterialSymbolsDownload.svg?component'

const toast = useToast()

const submissions = ref([])
const isEditing = ref(false)
const isLoading = ref(false)
const currentSubmission = ref(null)
const currentSubmissionId = ref(null)
const searchQuery = ref('')

const authStore = useAuthStore()

onMounted(async () => {
  await fetchSubmissions()
})

const fetchSubmissions = async () => {
  try {
    isLoading.value = true
    const response = await apiClient.get('/submission/climate')
    submissions.value = response.data
  } catch (error) {
    submissions.value = []
  }
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

const deleteSubmission = async (id) => {
  const response = await apiClient.delete(`/submission/climate/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Klimacheck erfolgreich gelöscht',
        life: 3000
      })
      await fetchSubmissions()
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Klimachecks',
        life: 3000
      })
  }
}

const checkLastEditor = (submission) => {
  let check = false
  if (submission.lastEditor) {
    check = submission.lastEditor.id !== submission.author.id
  }
  return check
}

const editSubmission = (submission) => {
  currentSubmission.value = { ...submission }
  currentSubmissionId.value = currentSubmission.value.id
  isEditing.value = true
}

const userRoleAccess = (forRoles = ['administration']) => {
  return forRoles.includes(authStore.userRole)
}

const copySubmission = async (id) => {
  try {
    const response = await apiClient.post(`/submission/climate/copy/${id}`)

    if (response.status === 201) {
      toast.add({
        severity: 'success',
        summary: 'Klimacheck erfolgreich kopiert',
        life: 3000
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Kopieren des Klimachecks',
      life: 3000
    })
  }
}

const publishSubmission = async (id, isPublished) => {
  try {
    const response = await apiClient.patch(`/submission/climate/${id}`, {
      isPublished
    })

    if (response.status === 200) {
      console.log(response.data)
      switch (response.data.isPublished) {
        case true:
          toast.add({
            severity: 'success',
            summary: 'Klimacheck ist veröffentlicht',
            life: 3000
          })
          break
        case false:
          toast.add({
            severity: 'success',
            summary: 'Veröffentlichung zurückgezogen',
            life: 3000
          })
          break
      }
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Fehler beim Veröffentlichen des Mobilitätschecks',
      life: 3000
    })
  }
}

const exportSubmission = async (id) => {
  try {
    const response = await apiClient.get(`/submission/climate/export/${id}`, {
      responseType: 'blob'
    })
    // Create a download link for the received Blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    const fileName = `klimacheck_${id}.pdf`
    link.setAttribute('download', fileName) // The file name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading the PDF:', error)
  }
}

const cancelEdit = () => {
  isEditing.value = false
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('de-DE', options)
}
</script>

<style scoped>
/* Add your styling here */
</style>
