<template>
  <div>
    <!-- Display list of submissions -->
    <BaseSpinner v-if="isLoading" class="m-10" />
    <div v-else-if="submissions.length === 0">
      <p class="font-lg font-bold m-5">Keine Mobilitätschecks gefunden.</p>
    </div>
    <div v-else>
      <InputText v-model="searchQuery" placeholder="Nach Maßnahme suchen" class="w-full mt-5" />
      <BaseCard v-for="(submission, ix) in filteredSubmissions" :key="submission.id">
        <div class="flex justify-between">
          <div>
            <h3 class="font-bold text-lg mb-4">{{ submission.label }}</h3>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <span class="font-semibold">Sachbearbeitung:</span>
              <span
                ><span>{{ submission.author?.firstName }} {{ submission.author?.lastName }}</span>
              </span>

              <span v-if="checkLastEditor(submission)" class="font-semibold"
                >Letzte Bearbeitung durch:</span
              >
              <span v-if="checkLastEditor(submission)">
                {{ submission.lastEditor?.firstName }} {{ submission.lastEditor?.lastName }}
              </span>
              <span class="font-semibold">Magistratvorlagennummer:</span>
              <span>{{ submission.administrationNo }}</span>
              <span class="font-semibold">Datum Magistratssitzung:</span>
              <span>{{ formatDate(submission.administrationDate) }}</span>
            </div>
          </div>
          <div class="flex space-x-4">
            <div class="grid grid-cols-1">
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
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
    <BaseModal v-model="mobilityStore.editMode">
      <template #header>
        <h2>{{ currentSubmission.label }} bearbeiten</h2>
      </template>
      <BaseSpinner v-if="mobilityStore.isLoading" class="m-10" />
      <MobilityForm
        v-else
        :submissionId="currentSubmission.id"
        @close-modal="cancelEdit"
        @item-updated="handleUpdate"
      />
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import apiClient from '@/services/axios'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import { useAuthStore } from '@/stores/auth'
import MobilityForm from '@/components/form/MobilityForm.vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import IconDelete from '@/assets/icons/MaterialSymbolsDelete.svg?component'
import IconEdit from '@/assets/icons/MaterialSymbolsEditSquare.svg?component'
import IconDownload from '@/assets/icons/MaterialSymbolsDownload.svg?component'

const toast = useToast()
const isLoading = ref(false)
const mobilityStore = useMobilitySubmissionStore()
const authStore = useAuthStore()

const submissions = ref([])
const currentSubmission = ref(null)
const searchQuery = ref('')

onMounted(async () => {
  await fetchSubmissions()
})

const fetchSubmissions = async () => {
  try {
    isLoading.value = true
    let filter = {}

    switch (authStore.userRole) {
      case 'administration':
        filter = {
          byUserRole: true
        }
        break
      case 'politician':
        filter = {
          byUserId: true
        }
        break
    }

    const response = await apiClient.post('/submission/mobility/filter', filter)
    submissions.value = response.data
  } catch (error) {
    submissions.value = []
  }
  isLoading.value = false
}

const deleteSubmission = async (id, ix) => {
  const response = await apiClient.delete(`/submission/mobility/${id}`)
  switch (response.status) {
    case 204:
      toast.add({
        severity: 'success',
        summary: 'Mobilitätscheck erfolgreich gelöscht',
        life: 3000
      })
      submissions.value.splice(ix, 1)
      break
    default:
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Löschen des Mobilitätschecks',
        life: 3000
      })
  }
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
      submission.desc.toLowerCase().includes(query) ||
      submission.createdAt.includes(query) // Date format remains the same, no need to lowercase
    isLoading.value = false
    return results
  })
})

const checkLastEditor = (submission) => {
  let check = false
  if (submission.lastEditor && submission.author) {
    check = submission.lastEditor.id !== submission.author.id
  }
  return check
}

const userRoleAccess = (forRoles = ['politician']) => {
  return forRoles.includes(authStore.userRole)
}

const editSubmission = (submission) => {
  currentSubmission.value = { ...submission }
  mobilityStore.editMode = true
  mobilityStore.fetchMobilitySubmission(currentSubmission.value.id)
}

const exportSubmission = async (id) => {
  try {
    const response = await apiClient.get(`/submission/mobility/export/${id}`, {
      responseType: 'blob'
    })
    // Create a download link for the received Blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    const fileName = `mobilitätscheck_${id}.pdf`
    link.setAttribute('download', fileName) // The file name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading the PDF:', error)
  }
}

const cancelEdit = () => {
  mobilityStore.editMode = false
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(date).toLocaleDateString('de-DE', options)
}

const handleUpdate = () => {
  fetchSubmissions()
}
</script>

<style scoped>
/* Add your styling here */
</style>
