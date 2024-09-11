<template>
  <form class="my-7" @submit.prevent="onSubmit">
    <div class="form-group field mt-7">
      <FloatLabel class="w-full">
        <InputText
          v-model="author"
          aria-describedby="author-help"
          :class="{ 'p-invalid': errors.author }"
          class="w-full"
          inputClass="w-full"
        />
        <label for="author" :class="{ 'p-invalid': errors.author }">Bearbeiter*in</label>
      </FloatLabel>
      <small v-if="errors.author" id="author-help" class="p-error">{{ errors.author }}</small>
    </div>

    <div class="form-group field mt-7">
      <FloatLabel class="w-full">
        <InputText
          id="administration-no"
          v-model="administrationNo"
          aria-describedby="administration-no-help"
          :class="{ 'p-invalid': errors.administrationNo }"
          class="w-full"
          inputClass="w-full"
        />
        <label for="administration-no" :class="{ 'p-invalid': errors.administrationNo }"
          >Magistratvorlagennummer</label
        >
      </FloatLabel>
      <small v-if="errors.administrationNo" id="administration-no-help" class="p-error">
        {{ errors.administrationNo }}
      </small>
    </div>

    <div class="form-group field mt-7">
      <FloatLabel>
        <Calendar
          id="administration-date"
          v-model="administrationDate"
          dateFormat="dd.mm.yy"
          showIcon
          iconDisplay="input"
          aria-describedby="administration-date-help"
          class="dont-close-on-select"
          inputClass="dont-close-on-select"
          :class="{ 'p-invalid': errors.administrationDate }"
        />
        <label for="administration-date" :class="{ 'p-invalid': errors.administrationDate }">
          Datum Magistratssitzung
        </label>
      </FloatLabel>
      <small v-if="errors.administrationDate" id="administration-date-help" class="p-error">
        {{ errors.administrationDate }}
      </small>
    </div>

    <div class="form-group field mt-7">
      <FloatLabel class="w-full">
        <InputText
          id="label"
          v-model="label"
          aria-describedby="label-help"
          :class="{ 'p-invalid': errors.label }"
          class="w-full"
          inputClass="w-full"
        />
        <label for="label" :class="{ 'p-invalid': errors.label }">Titel der Maßnahme</label>
      </FloatLabel>
      <small v-if="errors.label" id="label-help" class="p-error">{{ errors.label }}</small>
    </div>

    <div class="form-group field mt-7">
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
            :class="{ 'p-invalid': errors.impact }"
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
          <label
            for="impact-desc"
            class="font-bold text-lg"
            :class="{ 'p-invalid': errors.impactDesc }"
            >Kurzbeschreibung der Auswirkungen</label
          >
          <Textarea
            id="impact-desc"
            v-model="impactDesc"
            rows="5"
            aria-describedby="impact-desc-help"
            :class="{ 'p-invalid': errors.impactDesc }"
            class="w-full"
            inputClass="w-full"
          />

          <small v-if="errors.impactDesc" id="impact-desc-help" class="p-error">{{
            errors.impactDesc
          }}</small>
        </div>

        <div class="form-group field mt-7">
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
          <label for="alternative-desc" :class="{ 'p-invalid': errors.alternativeDesc }"
            ><div class="font-bold text-lg">Klimafreundliche Alternativen zu der Maßnahme</div>
            <div class="text-sm">
              Falls nicht vorhanden: Begründung der Alternativlosigkeit
            </div></label
          >
          <Textarea
            id="alternative-desc"
            v-model="alternativeDesc"
            rows="5"
            aria-describedby="alternative-desc-help"
            :class="{ 'p-invalid': errors.alternativeDesc }"
            class="w-full"
            inputClass="w-full"
          />

          <small v-if="errors.alternativeDesc" id="alternative-desc-help" class="p-error">{{
            errors.alternativeDesc
          }}</small>
        </div>
      </div>
    </div>
    <div v-if="impact" class="text-right mt-7">
      <BaseButton @click="closeModal" type="submit">
        <div v-if="editMode" class="flex">
          <IconSync class="me-1" height="20" /><span class="text-left w-18">Aktualisieren</span>
        </div>
        <div v-else class="flex">
          <IconSave class="me-1" height="20" /><span class="text-left w-18">Speichern</span>
        </div>
      </BaseButton>
      <BaseButton v-if="editMode" @click="exportSubmission(currentSubmissionId.value)"
        ><IconDownload class="me-1" height="20" /><span class="text-left w-18"
          >PDF-Export</span
        ></BaseButton
      >
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watchEffect, defineEmits, onMounted, defineModel } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import FloatLabel from 'primevue/floatlabel'
import RadioButton from 'primevue/radiobutton'
import HoverInfo from '@/components/ui/HoverInfo.vue'
import { useToast } from 'primevue/usetoast'
import apiClient from '@/services/axios'
import IconDownload from '@/assets/icons/MaterialSymbolsDownload.svg?component'
import IconSave from '@/assets/icons/MaterialSymbolsSave.svg?component'
import IconSync from '@/assets/icons/MaterialSymbolsSync.svg?component'

const impactOptions = ref({})
const impactGhgOptions = ref({})
const impactDurationOptions = ref({})

onMounted(async () => {
  await fetchImpactOptions()
  await fetchImpactGhgOptions()
  await fetchImpactDurationOptions()
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

// Define your enums
const impactEnum = ['positive', 'negative', 'no_effect']
const impactDurationEnum = ['short', 'medium', 'long']

// Validation schema
const schema = yup.object({
  author: yup.string().required('Angabe ist erforderlich'),
  administrationNo: yup.string().required('Angabe ist erforderlich'),
  administrationDate: yup.date().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich'),
  impact: yup
    .string()
    .oneOf(impactEnum, 'Ungültiger Wert für Impact')
    .required('Angabe ist erforderlich'),
  impactGhg: yup.number().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .integer('ImpactGhg muss eine ganze Zahl sein')
        .notOneOf([0], 'ImpactGhg darf nicht 0 sein')
        .min(-2, 'ImpactGhg muss zwischen -2 und 2 liegen')
        .max(2, 'ImpactGhg muss zwischen -2 und 2 liegen')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactAdaption: yup.number().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .integer('ImpactAdaption muss eine ganze Zahl sein')
        .notOneOf([0], 'ImpactAdaption darf nicht 0 sein')
        .min(-2, 'ImpactAdaption muss zwischen -2 und 2 liegen')
        .max(2, 'ImpactAdaption muss zwischen -2 und 2 liegen')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactDesc: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactDuration: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .oneOf(impactDurationEnum, 'Ungültiger Wert für Impact Duration')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  alternativeDesc: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  })
})

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

// Define form state
const [author] = defineField('author')
const [administrationNo] = defineField('administrationNo')
const [administrationDate] = defineField('administrationDate')
const [label] = defineField('label')
const [impact] = defineField('impact')
const [impactGhg] = defineField('impactGhg')
const [impactAdaption] = defineField('impactAdaption')
const [impactDesc] = defineField('impactDesc')
const [impactDuration] = defineField('impactDuration')
const [alternativeDesc] = defineField('alternativeDesc')

const fullName = computed(() => {
  const storeAuth = useAuthStore()
  return storeAuth.user.user_metadata.first_name + ' ' + storeAuth.user.user_metadata.last_name
})

setFieldValue('author', fullName.value)

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
    setFieldValue('author', submission.author)
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
    const response = await apiClient.put(
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
