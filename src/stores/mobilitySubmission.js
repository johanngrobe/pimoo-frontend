import { ref } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '@/services/axios'
import { useToast } from 'primevue/usetoast'

export const useMobilitySubmissionStore = defineStore('mobilitySubmission', () => {
  const mobilityObjectiveForm = ref([])

  // Fetch objectives from the API
  const fetchObjectives = async () => {
    try {
      const response = await apiClient.get('/objective/main')

      // Transform the objectives structure
      mobilityObjectiveForm.value = response.data.map((mainObjective) => ({
        mainObjective: { ...mainObjective },
        id: null,
        submissionId: null,
        target: false,
        subObjectives: mainObjective.subObjectives.map((subObjective) => ({
          subObjective: { ...subObjective },
          id: null,
          mobilityResultId: null,
          target: false,
          impact: null,
          spatialImpact: null,
          annotation: null,
          indicators: null
        }))
      }))
    } catch (error) {
      console.error('Error fetching objectives:', error)
    }
  }

  // Automatically fetch objectives when the store is created
  fetchObjectives()

  const formValid = ref({
    mobilityForm: false,
    mobilityOjectiveForm: false
  })

  const mobilityForm = ref({
    author: null,
    administrationNo: null,
    administrationDate: null,
    label: null,
    desc: null
  })

  function setMobilityFormValues(value) {
    formValid.value.submissionForm = true
    mobilityForm.value.author = value.author
    mobilityForm.value.administrationNo = value.administrationNo
    mobilityForm.value.administrationDate = value.administrationDate
    mobilityForm.value.label = value.label
    mobilityForm.value.desc = value.desc
  }

  const toast = useToast()

  const currentSubmissionId = ref(null)

  // Function to submit the entire mobility form and its objectives
  // Function to submit the entire mobility form and its objectives
  const submitMobilityForm = async () => {
    try {
      // 1. Submit the main mobility form
      const mobilityResponse = await apiClient.post('/submission/mobility', mobilityForm.value)
      currentSubmissionId.value = mobilityResponse.data.id // Capture the submission ID for linking objectives

      // 2. Loop through main objectives in `objective.value`
      for (const mainObjective of mobilityObjectiveForm.value) {
        // Submit the main objective, regardless of its target value
        const mainObjectiveResponse = await apiClient.post('/mobility-result', {
          submissionId: currentSubmissionId.value, // Link to the mobility submission (camelCase)
          mainObjectiveId: mainObjective.mainObjective.id, // ID of the main objective (camelCase)
          target: mainObjective.target // Submit target (true or false)
        })

        const mainObjectiveResultId = mainObjectiveResponse.data.id // Capture the ID for linking sub-objectives

        // 3. Loop through sub-objectives for all main objectives, regardless of main objective's target
        for (const subObjective of mainObjective.subObjectives) {
          if (mainObjective.target && subObjective.target) {
            // Submit sub-objective if both main and sub-objective targets are true
            await apiClient.post('/mobility-result/sub', {
              mobilityResultId: mainObjectiveResultId, // Link to the main objective result (camelCase)
              subObjectiveId: subObjective.subObjective.id, // ID of the sub-objective (camelCase)
              target: subObjective.target, // Target is true
              impact: subObjective.impact,
              spatialImpact: subObjective.spatialImpact, // camelCase
              annotation: subObjective.annotation,
              indicatorIds: subObjective.indicators
            })
          } else {
            // Submit sub-objective with false target and null values if main or sub-objective target is false
            await apiClient.post('/mobility-result/sub', {
              mobilityResultId: mainObjectiveResultId, // Link to the main objective result (camelCase)
              subObjectiveId: subObjective.subObjective.id // ID of the sub-objective (camelCase)
            })
          }
        }
      }
      // If everything was successful, trigger the toast notification
      toast.add({
        severity: 'success',
        summary: 'Mobilitätscheck erfolgreich gespeichert',
        life: 3000
      })
      editMode.value = true
      await fetchMobilitySubmission(currentSubmissionId.value)
    } catch (error) {
      console.error('Error submitting mobility form:', error)
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Speichern des Mobilitätschecks',
        detail: 'Bitte kontaktieren Sie den Administrator',
        life: 3000
      })
    }
  }

  const editMode = ref(false)

  const fetchMobilitySubmission = async (submissionId) => {
    try {
      const response = await apiClient.get(`/submission/mobility/${submissionId}`)

      setMobilityFormValues(response.data)
      mobilityObjectiveForm.value = response.data.objectives
    } catch (error) {
      console.error('Error fetching submission data:', error)
    }
  }

  const updateMobilitySubmission = async (submissionId) => {
    try {
      // 1. Submit the main mobility form
      await apiClient.put(`/submission/mobility/${submissionId}`, mobilityForm.value)

      // Loop through main objectives in `mobilityObjectiveForm.value`
      for (const mainObjective of mobilityObjectiveForm.value) {
        // Perform the update for the main objective
        await apiClient.put(`/mobility-result/${mainObjective.id}`, {
          submissionId: submissionId, // Link to the mobility submission (camelCase)
          mainObjectiveId: mainObjective.mainObjectiveId, // ID of the main objective (camelCase)
          target: mainObjective.target // Submit target (true or false)
        })

        // Loop through each sub-objective of the current main objective
        for (const subObjective of mainObjective.subObjectives) {
          // Perform the update for each sub-objective
          await apiClient.put(`/mobility-result/sub/${subObjective.id}`, {
            mobilityResultId: mainObjective.id, // Link to the main objective result (camelCase)
            subObjectiveId: subObjective.subObjectiveId, // ID of the sub-objective (camelCase)
            target: subObjective.target, // Target value (true or false)
            impact: subObjective.impact, // Impact (can be null if not applicable)
            spatialImpact: subObjective.spatialImpact, // Spatial impact (can be null)
            annotation: subObjective.annotation, // Annotation or notes (can be null)
            indicatorIds: subObjective.indicators // List of indicator IDs
          })
        }
      }
      toast.add({
        severity: 'success',
        summary: 'Mobilitätsziele erfolgreich aktualisiert',
        life: 3000
      })
    } catch (error) {
      console.error('Error updating mobility objectives:', error)
      toast.add({
        severity: 'error',
        summary: 'Fehler beim Aktualisieren der Mobilitätsziele',
        detail: 'Bitte kontaktieren Sie den Administrator',
        life: 3000
      })
      throw error // Re-throw the error to handle it in upstream calls
    }
  }

  async function $reset() {
    currentSubmissionId.value = null

    formValid.value = {
      mobilityForm: false,
      mobilityOjectiveForm: false
    }
    mobilityForm.value = {
      author: null,
      administrationNo: null,
      administrationDate: null,
      label: null,
      desc: null
    }
    editMode.value = false
    await fetchObjectives()
  }

  return {
    formValid,
    currentSubmissionId,
    setMobilityFormValues,
    submitMobilityForm,
    fetchMobilitySubmission,
    updateMobilitySubmission,
    editMode,
    mobilityObjectiveForm,
    mobilityForm,
    fetchObjectives,
    $reset
  }
})
