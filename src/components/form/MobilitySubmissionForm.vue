<template>
  <div>
    <BaseSpinner v-if="isLoading" />
    <form v-else class="grid grid-cols-1 gap-y-4 my-7" @submit.prevent="onSubmit">
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
        <small v-if="errors.author" id="author-help" class="p-error block">{{
          errors.author
        }}</small>
      </div>

      <div class="form-group field">
        <FloatLabel variant="on">
          <InputText
            id="administration-no"
            v-model="administrationNo"
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
            :invalid="!!errors.administrationDate"
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
      <div class="flex justify-end w-full">
        <ButtonSave type="submit">{{ submitButtonLabel }}</ButtonSave>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/mobilitySubmissionForm'
import { toTypedSchema } from '@vee-validate/yup'
import { createItem, createItemSilent, fetchItems } from '@/composables/crud'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import FloatLabel from 'primevue/floatlabel'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

const submitButtonLabel = computed(() =>
  props.editMode ? 'Änderungen speichern' : 'Speichern & zu den Leitzielen'
)

const router = useRouter()
const authStore = useAuthStore()
const user = ref({})
const isLoading = ref(false)

const authorName = computed(() => {
  return `${user.value.firstName} ${user.value.lastName}`
})

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(schema)
})

const [administrationNo] = defineField('administrationNo')
const [administrationDate] = defineField('administrationDate')
const [label] = defineField('label')
const [desc] = defineField('desc')

onMounted(async () => {
  user.value = await authStore.getUser()
  if (props.editMode) {
    const { author, administrationNo, administrationDate, label, desc } = props.item
    setValues({ author, administrationNo, administrationDate, label, desc })
  }
})

const createMobilityResult = async (submissionId) => {
  const objectives = await fetchItems('/objective/main')
  objectives.forEach(async (objective) => {
    const mainObjectiveResponse = await createItemSilent({
      model: 'mobility-result',
      values: {
        submissionId,
        mainObjectiveId: objective.id
      }
    })

    objective.subObjectives.forEach(async (subObjective) => {
      await createItemSilent({
        model: 'mobility-result/sub',
        values: {
          mobilityResultId: mainObjectiveResponse.id,
          subObjectiveId: subObjective.id
        }
      })
    })
  })
}

const emit = defineEmits(['update-item'])

const onSubmit = handleSubmit(async (values) => {
  if (props.editMode) {
    emit('update-item', { modelId: props.item.id, values })
  } else {
    isLoading.value = true
    console.log('values', values)
    const response = await createItem({
      model: 'submission/mobility',
      values: values,
      detail: {
        success: 'Mobilitätscheck erfolgreich erstellt',
        error: 'Fehler beim Erstellen des Mobilitätschecks'
      }
    })

    await createMobilityResult(response.id)

    router.replace({
      name: 'edit-mobility-check',
      params: { mobilitySubmissionId: response.id },
      query: { tab: 'objectives' }
    })
    isLoading.value = false
  }
})
</script>

<style scoped>
.p-invalid {
  @apply border-red-600 text-red-600;
}

.p-error {
  @apply text-red-600;
}
</style>
