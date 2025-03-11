<template>
  <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-y-4 my-7">
    <div class="form-group field">
      <FloatLabel variant="on">
        <InputText
          v-model="authorName"
          aria-describedby="author-help"
          :invalid="!!errors.author"
          class="w-full"
          inputClass="w-full"
          disabled
        />
        <label for="author">Bearbeiter*in</label>
      </FloatLabel>
      <small v-if="errors.author" id="author-help" class="p-error block">{{ errors.author }}</small>
    </div>

    <div class="form-group field">
      <FloatLabel variant="on">
        <InputText
          id="administration-no"
          v-model="administrationNo"
          aria-describedby="administration-no-help"
          :invalid="!!errors.administrationNo"
          class="w-full"
          inputClass="w-full"
        />
        <label for="administration-no">Magistratsvorlagennummer</label>
      </FloatLabel>
      <small v-if="errors.administrationNo" id="administration-no-help" class="p-error block">
        {{ errors.administrationNo }}
      </small>
    </div>

    <div class="form-group field">
      <FloatLabel variant="on">
        <DatePicker
          id="administration-date"
          v-model="administrationDate"
          showIcon
          iconDisplay="input"
          aria-describedby="administration-date-help"
          class="dont-close-on-select"
          inputClass="dont-close-on-select"
          :invalid="!!errors.administrationDate"
        />
        <label for="administration-date"> Datum Magistratssitzung </label>
      </FloatLabel>
      <small v-if="errors.administrationDate" id="administration-date-help" class="p-error">
        {{ errors.administrationDate }}
      </small>
    </div>

    <div class="form-group field">
      <FloatLabel variant="on">
        <InputText
          id="label"
          v-model="label"
          aria-describedby="label-help"
          :invalid="!!errors.label"
          class="w-full"
          inputClass="w-full"
        />
        <label for="label">Titel der Maßnahme</label>
      </FloatLabel>
      <small v-if="errors.label" id="label-help" class="p-error block">{{ errors.label }}</small>
    </div>

    <div class="form-group field">
      <label for="impact" class="font-bold text-lg" :class="{ 'p-invalid': errors.impact }">
        Einschätzung der Klimarelevanz
      </label>

      <!-- Radio Buttons for Impact Options -->
      <div class="flex items-center space-x-4 mt-2">
        <div v-for="option in impactOptions" :key="option.value" class="flex items-center">
          <RadioButton
            :id="`impact-${option.value}`"
            v-model="impact"
            :value="option.value"
            name="impact"
            :invalid="!!errors.impact"
          />
          <label :for="`impact-${option.value}`" class="ml-2">
            {{ option.label }}
          </label>
        </div>
      </div>

      <!-- Error Message -->
      <small v-if="errors.impact" id="impact-help" class="p-error">{{ errors.impact }}</small>
    </div>

    <div v-if="continueForm">
      <div class="form-group mt-7">
        <div class="flex">
          <div class="text-lg font-bold me-1">Art und Umfang der Auswirkungen</div>
          <HoverInfo icon="MaterialSymbolsInfo.svg">
            <template #title>Frage 2 zielt auf die Klimawirkung im jeweiligen Bereich ab.</template>
            <ul>
              <li>Zwei grünen Pfeile: erhebliche positive Auswirkungen &lt; 100 t CO2e pro Jahr</li>
              <li>Ein grüner Pfeil: positive Auswirkungen &lt; 100 t CO2e pro Jahr</li>
              <li>Ein roter Pfeil: negative Auswirkungen &lt; 100 t CO2e pro Jahr</li>
              <li>Zwei rote Pfeile: erhebliche negative Auswirkungen &lt; 100 t CO2e pro Jahr</li>
            </ul>
          </HoverInfo>
        </div>
        <div>
          <!-- Table-like structure with labels on the left and radio buttons on the right -->
          <div class="grid grid-cols-6 gap-4">
            <!-- Empty cell for top-left corner -->
            <div class="col-span-2"></div>

            <!-- Column labels for the radio buttons -->
            <div v-for="option in impactGhgOptions" :key="option.value" class="text-center">
              <label class="block text-gray-700 font-medium">
                {{ option.label }}
              </label>
            </div>

            <!-- Impact GHg Row -->
            <div class="flex col-span-2 items-center">
              <div class="text-md mr-1" :class="{ 'p-invalid': errors.impactGhg }">
                THG-Emissionen
              </div>
              <HoverInfo icon="MaterialSymbolsInfo.svg">Treibhausgasemissionen</HoverInfo>
            </div>
            <div v-for="option in impactGhgOptions" :key="option.value" class="text-center">
              <RadioButton
                :id="`ghg-${option.value}`"
                v-model="impactGhg"
                :value="option.value"
                name="impactGhg"
                :class="{ 'p-invalid': errors.impactGhg }"
              />
            </div>

            <!-- Impact Adaption Row -->
            <div class="col-span-2">
              <div class="text-md mr-1" :class="{ 'p-invalid': errors.impactAdaption }">
                Klimaanpassung
              </div>
            </div>
            <div v-for="option in impactGhgOptions" :key="option.value" class="text-center">
              <RadioButton
                :id="`adaption-${option.value}`"
                v-model="impactAdaption"
                :value="option.value"
                name="impactAdaption"
                :class="{ 'p-invalid': errors.impactAdaption }"
              />
            </div>
          </div>

          <!-- Error messages -->
          <small v-if="errors.impactGhg" id="impact-ghg-help" class="p-error">
            {{ errors.impactGhg }}
          </small>
          <small v-if="errors.impactAdaption" id="impact-adaption-help" class="p-error">
            {{ errors.impactAdaption }}
          </small>
        </div>

        <div class="form-group field mt-7">
          <FloatLabel variant="on">
            <label for="impact-desc">Kurzbeschreibung der Auswirkungen</label>
            <Textarea
              id="impact-desc"
              v-model="impactDesc"
              rows="5"
              aria-describedby="impact-desc-help"
              :invalid="!!errors.impactDesc"
              class="w-full"
              inputClass="w-full"
            />
          </FloatLabel>
          <small v-if="errors.impactDesc" id="impact-desc-help" class="p-error block">{{
            errors.impactDesc
          }}</small>
        </div>

        <div class="form-group field">
          <label for="impact" class="font-bold text-lg" :class="{ 'p-invalid': errors.impact }">
            Dauer der Auswirkungen
          </label>

          <!-- Radio Buttons for Impact Options -->
          <div class="flex items-center space-x-4 mt-2">
            <div
              v-for="option in impactDurationOptions"
              :key="option.value"
              class="flex items-center"
            >
              <RadioButton
                :id="`impact-duration-${option.value}`"
                v-model="impactDuration"
                :value="option.value"
                name="impact-duration"
                :class="{ 'p-invalid': errors.impactDuration }"
              />
              <label :for="`impact-duration-${option.value}`" class="ml-2">
                {{ option.label }}
              </label>
            </div>
          </div>

          <!-- Error Message -->
          <small v-if="errors.impactDuration" id="impact-help" class="p-error">{{
            errors.impactDuration
          }}</small>
        </div>

        <div class="form-group field mt-7">
          <FloatLabel variant="on">
            <label for="alternative-desc"> Klimafreundliche Alternativen zu der Maßnahme </label>
            <Textarea
              id="alternative-desc"
              v-model="alternativeDesc"
              rows="5"
              aria-describedby="alternative-desc-help"
              :invalid="!!errors.alternativeDesc"
              class="w-full"
              inputClass="w-full"
            />
          </FloatLabel>
          <small>* Falls nicht vorhanden: Begründung der Alternativlosigkeit </small>

          <small v-if="errors.alternativeDesc" id="alternative-desc-help" class="p-error block">{{
            errors.alternativeDesc
          }}</small>
        </div>
      </div>
    </div>
    <div v-if="impact" class="flex w-full justify-end">
      <ButtonSync v-if="editMode" @click="closeModal" type="submit" />
      <ButtonSave v-else @click="closeModal" type="submit" />
      <ButtonDownload
        v-if="editMode"
        @click="exportSubmission(currentSubmissionId.value)"
      ></ButtonDownload>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, defineModel } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/climateForm'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import HoverInfo from '@/components/ui/HoverInfo.vue'

import { apiClient } from '@/services/axios'
import ButtonDownload from '@/components/ui/ButtonDownload.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import ButtonSync from '@/components/ui/ButtonSync.vue'
import FloatLabel from 'primevue/floatlabel'

const impactOptions = ref({})
const impactGhgOptions = ref({})
const impactDurationOptions = ref({})
const user = ref({})

const authStore = useAuthStore()

onMounted(async () => {
  await fetchImpactOptions()
  await fetchImpactGhgOptions()
  await fetchImpactDurationOptions()
  user.value = await authStore.getUser()
})

const fetchImpactOptions = async () => {
  const response = await apiClient.get('/option/climate/impact')
  impactOptions.value = response.data
}

const fetchImpactGhgOptions = async () => {
  const response = await apiClient.get('/option/climate/impact-ghg')
  impactGhgOptions.value = response.data
}

const fetchImpactDurationOptions = async () => {
  const response = await apiClient.get('/option/climate/impact-duration')
  impactDurationOptions.value = response.data
}

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

// Define form state
// const [author] = defineField('author')
const [administrationNo] = defineField('administrationNo')
const [administrationDate] = defineField('administrationDate')
const [label] = defineField('label')
const [impact] = defineField('impact')
const [impactGhg] = defineField('impactGhg')
const [impactAdaption] = defineField('impactAdaption')
const [impactDesc] = defineField('impactDesc')
const [impactDuration] = defineField('impactDuration')
const [alternativeDesc] = defineField('alternativeDesc')

const authorName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`
})

// setFieldValue('author', fullName.value)

const continueForm = computed(() => {
  switch (impact.value) {
    case 'positive':
    case 'negative':
      return true
    default:
      return false
  }
})

// Props to determine if the form is in edit mode
const currentSubmissionId = defineModel({ default: null })

const editMode = computed(() => currentSubmissionId.value !== null)

// Fetch existing data if editing
const fetchSubmissionData = async () => {
  if (editMode.value) {
    const response = await apiClient.get(`/submission/climate/${currentSubmissionId.value}`)
    const submission = response.data

    // Populate form fields with existing submission data
    // setFieldValue('author', submission.author)
    setFieldValue('administrationNo', submission.administrationNo)
    setFieldValue('administrationDate', new Date(submission.administrationDate))
    setFieldValue('label', submission.label)
    setFieldValue('impact', submission.impact)
    setFieldValue('impactGhg', submission.impactGhg)
    setFieldValue('impactAdaption', submission.impactAdaption)
    setFieldValue('impactDesc', submission.impactDesc)
    setFieldValue('impactDuration', submission.impactDuration)
    setFieldValue('alternativeDesc', submission.alternativeDesc)
  }
}

// Watch for changes in submissionId and fetch data when necessary
watchEffect(() => {
  if (editMode.value) {
    fetchSubmissionData()
  }
})

// Emit event to close modal
const emit = defineEmits(['close-modal'])

const closeModal = () => {
  if (editMode.value) {
    emit('close-modal')
  }
}

const toast = useToast()

// Handle form submission for both create (POST) and edit (PUT)
const onSubmit = handleSubmit(async (values) => {
  const formattedValues = { ...values }

  // Format the date to yyyy-mm-dd if it's a Date object
  if (values.administrationDate instanceof Date) {
    const tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
    formattedValues.administrationDate = new Date(values.administrationDate - tzoffset)
      .toISOString()
      .split('T')[0]
  }

  if (editMode.value) {
    // PUT request to update existing submission
    const response = await apiClient.patch(
      `/submission/climate/${currentSubmissionId.value}`,
      formattedValues
    )
    switch (response.status) {
      case 200:
        toast.add({ severity: 'success', summary: 'Klimacheck aktualisiert', life: 3000 })
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Aktualisieren des Klimachecks',
          message: 'Kontaktieren Sie den Support.',
          life: 3000
        })
    }
  } else {
    // POST request to create a new submission
    const response = await apiClient.post('/submission/climate', formattedValues)
    switch (response.status) {
      case 200:
        toast.add({ severity: 'success', summary: 'Klimacheck gespeichert', life: 3000 })
        currentSubmissionId.value = response.data.id
        break
      default:
        toast.add({
          severity: 'error',
          summary: 'Fehler beim Speichern des Klimachecks',
          message: 'Kontaktieren Sie den Support.',
          life: 3000
        })
    }
  }
})

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
</script>

<style scoped>
.p-invalid {
  @apply border-red-600 text-red-600;
}

.p-error {
  @apply text-red-600 bg-red-100 border-2 rounded-sm m-2 px-1;
}
</style>
