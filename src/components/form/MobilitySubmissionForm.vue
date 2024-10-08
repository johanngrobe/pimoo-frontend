<template>
  <form class="my-7" @submit.prevent="onSubmit">
    <div class="form-group field mt-7">
      <label for="author" :class="{ 'p-invalid': errors.author }">Bearbeiter*in</label>
      <InputText
        v-model="author"
        aria-describedby="author-help"
        :class="{ 'p-invalid': errors.author }"
        class="w-full"
        inputClass="w-full"
      />
      <small v-if="errors.author" id="author-help" class="p-error">{{ errors.author }}</small>
    </div>

    <div class="form-group field mt-7">
      <label for="administration-no" :class="{ 'p-invalid': errors.administrationNo }"
        >Magistratvorlagennummer</label
      >
      <InputText
        id="administration-no"
        v-model="administrationNo"
        aria-describedby="administration-no-help"
        :class="{ 'p-invalid': errors.administrationNo }"
        class="w-full"
        inputClass="w-full"
      />
      <small v-if="errors.administrationNo" id="administration-no-help" class="p-error">
        {{ errors.administrationNo }}
      </small>
    </div>

    <div class="form-group field mt-7">
      <label for="administration-date" :class="{ 'p-invalid': errors.administrationDate }">
        Datum Magistratssitzung </label
      ><br />
      <DatePicker
        id="administration-date"
        v-model="administrationDate"
        aria-describedby="administration-date-help"
        showIcon
        iconDisplay="input"
        :class="{ 'p-invalid': errors.administrationDate }"
        class="w-52"
        dateFormat="dd.mm.yy"
      />
      <small v-if="errors.administrationDate" id="administration-date-help" class="p-error">
        {{ errors.administrationDate }}
      </small>
    </div>

    <div class="form-group field mt-7">
      <label for="label" :class="{ 'p-invalid': errors.label }">Titel der Maßnahme</label>
      <InputText
        id="label"
        v-model="label"
        aria-describedby="label-help"
        :class="{ 'p-invalid': errors.label }"
        class="w-full"
        inputClass="w-full"
      />

      <small v-if="errors.label" id="label-help" class="p-error">{{ errors.label }}</small>
    </div>

    <div class="form-group field mt-7">
      <label for="desc" :class="{ 'p-invalid': errors.desc }">Beschreibung der Maßnahme</label>

      <Textarea
        id="desc"
        v-model="desc"
        rows="5"
        aria-describedby="descr-help"
        :class="{ 'p-invalid': errors.desc }"
        class="w-full"
        inputClass="w-full"
      />

      <small v-if="errors.desc" id="desc-help" class="p-error">{{ errors.desc }}</small>
    </div>
  </form>
</template>

<script setup>
import { computed, defineEmits, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'

// Validation schema
const schema = yup.object({
  author: yup.string().required('Angabe ist erforderlich'),
  administrationNo: yup.string().required('Angabe ist erforderlich'),
  administrationDate: yup.date().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich'),
  desc: yup.string().required('Angabe ist erforderlich')
})

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

// Define form state
const [author] = defineField('author')
const [administrationNo] = defineField('administrationNo')
const [administrationDate] = defineField('administrationDate')
const [label] = defineField('label')
const [desc] = defineField('desc')

const authStore = useAuthStore()

const fullName = computed(() => {
  return authStore.user.user_metadata.first_name + ' ' + authStore.user.user_metadata.last_name
})

setFieldValue('author', fullName.value)

const mobilityStore = useMobilitySubmissionStore()

const fetchSubmissionData = async () => {
  // Populate form fields with existing submission data
  setFieldValue('author', mobilityStore.mobilityForm.author)
  setFieldValue('administrationNo', mobilityStore.mobilityForm.administrationNo)
  setFieldValue('administrationDate', new Date(mobilityStore.mobilityForm.administrationDate))
  setFieldValue('label', mobilityStore.mobilityForm.label)
  setFieldValue('desc', mobilityStore.mobilityForm.desc)
}

// Watch for changes in submissionId and fetch data when necessary
watchEffect(() => {
  if (mobilityStore.editMode) {
    fetchSubmissionData()
  }
})

const emit = defineEmits(['valid-form'])

const onSubmit = handleSubmit((values) => {
  const formattedValues = { ...values }
  // Format the date to yyyy-mm-dd if it's a Date object
  if (values.administrationDate instanceof Date) {
    const tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
    formattedValues.administrationDate = new Date(values.administrationDate - tzoffset)
      .toISOString()
      .split('T')[0]
  }

  mobilityStore.setMobilityFormValues(formattedValues)
  mobilityStore.formValid.mobilityForm = true
  emit('valid-form', { from: 'mobilityForm', to: 'mobilityObjectiveForm' })
})

defineExpose({
  onSubmit
})
</script>

<style scoped>
.p-invalid {
  @apply border-red-600 text-red-600;
}

.p-error {
  @apply text-red-600 bg-red-100 border-2 rounded-sm m-2 px-1;
}
</style>
