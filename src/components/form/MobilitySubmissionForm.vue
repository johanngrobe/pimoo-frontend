<template>
  <form class="grid grid-cols-1 gap-y-4 my-7" @submit.prevent="onSubmit">
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
        <label for="author">Sachbearbeitung</label>
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
          aria-describedby="administration-date-help"
          showIcon
          iconDisplay="input"
          :invalid="!!errors.administrationDate"
          dateFormat="dd.mm.yy"
        />
        <label for="administration-date"> Datum Magistratssitzung </label>
      </FloatLabel>
      <small v-if="errors.administrationDate" id="administration-date-help" class="p-error block">
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
      <FloatLabel variant="on">
        <Textarea
          id="desc"
          v-model="desc"
          rows="5"
          aria-describedby="descr-help"
          :invalid="!!errors.desc"
          class="w-full"
          inputClass="w-full"
        />
        <label for="desc">Beschreibung der Maßnahme</label>
      </FloatLabel>
      <small v-if="errors.desc" id="desc-help" class="p-error block">{{ errors.desc }}</small>
    </div>
  </form>
</template>

<script setup>
import { computed, defineEmits, watchEffect, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/mobilitySubmissionForm'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import FloatLabel from 'primevue/floatlabel'

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema
})

// Define form state
// const [author] = defineField('author')
const [administrationNo] = defineField('administrationNo')
const [administrationDate] = defineField('administrationDate')
const [label] = defineField('label')
const [desc] = defineField('desc')

const authStore = useAuthStore()

const user = ref({})

onMounted(async () => {
  user.value = await authStore.getUser()
})

const authorName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`
})

// setFieldValue('author', fullName.value)

const mobilityStore = useMobilitySubmissionStore()

const fetchSubmissionData = async () => {
  // Populate form fields with existing submission data
  // setFieldValue('author', mobilityStore.mobilityForm.author)
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
