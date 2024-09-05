<template>
  <div>
    <PrimeToast position="top-center" />
    <!-- Display list of submissions -->
    <div v-if="submissions.length === 0">
      <p class="font-lg font-bold m-5">Keine Klimachecks gefunden.</p>
    </div>
    <BaseCard v-else v-for="submission in submissions" :key="submission.id">
      <div class="flex justify-between">
        <div>
          <h3 class="font-bold text-lg mb-4">{{ submission.label }}</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1">
            <span class="font-semibold">Bearbeiter*in:</span>
            <span>{{ submission.author }}</span>
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
            <BaseButton @click="exportSubmission(submission.id)">PDF-Export</BaseButton>
            <BaseButton @click="editSubmission(submission)">Bearbeiten</BaseButton>
            <!-- Edit form (appears when editing) -->
            <BaseButton @click="deleteSubmission(submission.id)" class="bg-red-500"
              >Löschen</BaseButton
            >
          </div>
        </div>
      </div>
    </BaseCard>
    <BaseModal v-model="isEditing">
      <template #header>
        <h2>{{ currentSubmission.label }} bearbeiten</h2>
      </template>
      <ClimateSubmissionForm :submissionId="currentSubmission.id" @close-modal="cancelEdit" />
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/services/axios'
import ClimateSubmissionForm from '@/components/form/ClimateForm.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const submissions = ref([])
const isEditing = ref(false)
const currentSubmission = ref(null)

onMounted(async () => {
  await fetchSubmissions()
})

const fetchSubmissions = async () => {
  try {
    const response = await apiClient.get('/submission/climate')
    submissions.value = response.data
  } catch (error) {
    submissions.value = []
  }
}

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

const editSubmission = (submission) => {
  currentSubmission.value = { ...submission }
  isEditing.value = true
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
