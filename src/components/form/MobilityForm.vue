<template>
  <BaseCard :collapsable="true" :isCollapsed="form.mobilityForm">
    <template #title>
      <div @click="toggleForm('mobilityForm')">
        <h2 class="text-3xl font-extrabold dark:text-white">Allgemeine Informationen</h2>
      </div>
    </template>
    <MobilitySubmissionForm @valid-form="toggleFormSubmit" />
  </BaseCard>
  <BaseCard :collapsable="true" :isCollapsed="form.mobilityObjectiveForm">
    <template #title>
      <h2
        class="text-3xl font-extrabold dark:text-white"
        @click="toggleForm('mobililtyObjectiveForm')"
      >
        Leitziele
      </h2>
    </template>
    <MobilityMainObjectiveForm @valid-form="toggleFormSubmit" />
  </BaseCard>
  <div class="text-right mt-7" v-if="mobilityStore.formValid.mobilityForm">
    <BaseButton @click="handleSubmit" type="submit">{{
      isEditMode ? 'Aktualisieren' : 'Speichern'
    }}</BaseButton>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watchEffect } from 'vue'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import MobilitySubmissionForm from '@/components/form/MobilitySubmissionForm.vue'
import MobilityMainObjectiveForm from '@/components/form/MobilityMainObjectiveForm.vue'

const props = defineProps({
  submissionId: {
    type: Number,
    default: null
  }
})

const isEditMode = computed(() => props.submissionId !== null)

const mobilityStore = useMobilitySubmissionStore()

// Watch for changes in submissionId and fetch data when necessary
watchEffect(() => {
  if (isEditMode.value) {
    mobilityStore.fetchMobilitySubmission(props.submissionId)
  }
})

const form = ref({
  mobilityForm: false,
  mobilityObjectiveForm: true
})

const toggleFormSubmit = ({ from, to }) => {
  if (!form[from]) {
    Object.keys(form.value).forEach((key) => {
      form.value[key] = key === to ? false : true
    })
  }
}

const toggleForm = (formName) => {
  form.value[formName] = !form.value[formName]
}

// Emit event to close modal
const emit = defineEmits(['close-modal'])

const closeModal = () => {
  if (isEditMode.value) {
    emit('close-modal')
  }
}

const handleSubmit = async () => {
  await mobilityStore.submitMobilityForm()
  if (isEditMode.value) {
    closeModal()
  }
}
</script>

<style></style>
