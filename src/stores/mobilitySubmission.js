import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMobilitySubmissionStore = defineStore('mobilitySubmission', () => {
  const mobilityObjectiveForm = ref([])
  const isLoading = ref(false)

  const formValid = ref({
    mobilityForm: false,
    mobilityOjectiveForm: false
  })

  const currentSubmissionId = ref(null)

  const editMode = ref(false)

  async function $reset() {
    currentSubmissionId.value = null

    formValid.value = {
      mobilityForm: false,
      mobilityOjectiveForm: false
    }
    editMode.value = false
  }

  return {
    isLoading,
    formValid,
    currentSubmissionId,
    editMode,
    mobilityObjectiveForm,
    $reset
  }
})
