<template>
  <BaseCard :collapsable="true" :isCollapsed="formState.mobilityForm">
    <template #title>
      <div @click="toggleForm('mobilityForm')">
        <h2 class="text-3xl font-extrabold dark:text-white">Allgemeine Informationen</h2>
      </div>
    </template>
    <MobilitySubmissionForm ref="mobilitySubmissionFormRef" />
  </BaseCard>
  <BaseCard :collapsable="true" :isCollapsed="formState.mobilityObjectiveForm">
    <template #title>
      <h2
        class="text-3xl font-extrabold dark:text-white"
        @click="toggleForm('mobilityObjectiveForm')"
      >
        Leitziele
      </h2>
    </template>
    <MobilityMainObjectiveForm />
  </BaseCard>
  <div class="flex w-full justify-end mt-7">
    <ButtonSync v-if="mobilityStore.editMode" @click="handleSubmit" type="submit"></ButtonSync>
    <ButtonSave v-else @click="handleSubmit" type="submit"></ButtonSave>
    <ButtonDownload
      v-if="showExportButton"
      @click="exportSubmission(mobilityStore.currentSubmissionId)"
    ></ButtonDownload>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch } from 'vue'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import apiClient from '@/services/axios'
import MobilitySubmissionForm from '@/components/form/MobilitySubmissionForm.vue'
import MobilityMainObjectiveForm from '@/components/form/MobilityMainObjectiveForm.vue'
import ButtonDownload from '@/components/ui/ButtonDownload.vue'
import ButtonSync from '@/components/ui/ButtonSync.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  submissionId: {
    type: Number,
    default: null
  },
  initialFormState: {
    type: Object,
    default: () => ({
      mobilityForm: false,
      mobilityObjectiveForm: false
    })
  }
})

const mobilityStore = useMobilitySubmissionStore()

// Watch for changes in submissionId and fetch data when necessary
watchEffect(() => {
  if (!mobilityStore.editMode) {
    mobilityStore.$reset
  }
})

// Create a reactive local copy of the form state
const formState = ref({ ...props.initialFormState })

// Watch for prop changes to update local state if the prop changes dynamically
watch(
  () => props.initialFormState,
  (newVal) => {
    formState.value = { ...newVal }
  }
)

// const form = ref({
//   mobilityForm: false,
//   mobilityObjectiveForm: true
// })

// const toggleFormSubmit = ({ from, to }) => {
//   if (!formState[from]) {
//     Object.keys(formState.value).forEach((key) => {
//       formState.value[key] = key === to ? false : true
//     })
//   }
// }

const toggleForm = (formName) => {
  formState.value[formName] = !formState.value[formName]
}

// Emit event to close modal
const emit = defineEmits(['close-modal', 'item-updated'])

const closeModal = () => {
  if (mobilityStore.editMode) {
    emit('close-modal')
  }
}

const showExportButton = ref(false)
const mobilitySubmissionFormRef = ref(null)

const handleSubmit = async () => {
  if (mobilitySubmissionFormRef.value) {
    await mobilitySubmissionFormRef.value.onSubmit()
  }

  if (mobilityStore.formValid.mobilityForm) {
    if (mobilityStore.editMode) {
      await mobilityStore.updateMobilitySubmission(props.submissionId)
      closeModal()
      emit('item-updated')
    } else {
      await mobilityStore.submitMobilityForm()
      showExportButton.value = true
    }
  }
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
</script>

<style></style>
