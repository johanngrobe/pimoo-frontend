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
                :invalid="!!errors.impactGhg"
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
                :invalid="!!errors.impactAdaption"
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
                :invalid="!!errors.impactDuration"
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
      <div v-if="editModeAfterSubmit" class="flex gap-2">
        <ButtonSync @click="closeModal" type="submit">Aktualisieren</ButtonSync>
        <ButtonDownload @click="onExport">PDF-Export</ButtonDownload>
      </div>
      <div v-else>
        <ButtonSave @click="closeModal" type="submit">Speichern</ButtonSave>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/climateForm'
import { toTypedSchema } from '@vee-validate/yup'
import { createItem, fetchItems, updateItem, exportItem } from '@/composables/crud'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import FloatLabel from 'primevue/floatlabel'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import HoverInfo from '@/components/ui/HoverInfo.vue'
import ButtonDownload from '@/components/ui/ButtonDownload.vue'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import ButtonSync from '@/components/ui/ButtonSync.vue'

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

const editModeAfterSubmit = ref(false)
const modelIdAfterSubmit = ref(null)
const impactOptions = ref({})
const impactGhgOptions = ref({})
const impactDurationOptions = ref({})
const user = ref({})

const authStore = useAuthStore()

const fetchOptions = async () => {
  impactOptions.value = await fetchItems('option/climate/impact')
  impactGhgOptions.value = await fetchItems('option/climate/impact-ghg')
  impactDurationOptions.value = await fetchItems('option/climate/impact-duration')
}

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: toTypedSchema(schema)
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

onMounted(async () => {
  await fetchOptions()
  user.value = await authStore.getUser()

  if (props.editMode) {
    const {
      author,
      administrationNo,
      administrationDate,
      label,
      impact,
      impactGhg,
      impactAdaption,
      impactDesc,
      impactDuration,
      alternativeDesc
    } = props.item
    setValues({
      author,
      administrationNo,
      administrationDate,
      label,
      impact,
      impactGhg,
      impactAdaption,
      impactDesc,
      impactDuration,
      alternativeDesc
    })
  }
})

const continueForm = computed(() => {
  switch (impact.value) {
    case 'positive':
    case 'negative':
      return true
    default:
      return false
  }
})

// Emit event to close modal
const emit = defineEmits(['close-modal', 'update-item', 'add-item', 'export-item'])

const closeModal = () => {
  if (props.editMode) {
    emit('close-modal')
  }
}

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
  if (props.editMode) {
    emit('update-item', { modelId: props.item.id, values: formattedValues })
  } else {
    if (editModeAfterSubmit.value) {
      // PUT request to update existing submission
      await updateItem({
        model: 'submission/climate',
        modelId: modelIdAfterSubmit.value,
        values: formattedValues,
        detail: {
          success: 'Klimacheck aktualisiert',
          error: 'Fehler beim Aktualisieren des Klimachecks'
        }
      })
    } else {
      // POST request to create a new submission
      const response = await createItem({
        model: 'submission/climate',
        values: formattedValues,
        detail: {
          success: 'Klimacheck gespeichert',
          error: 'Fehler beim Speichern des Klimachecks'
        }
      })
      modelIdAfterSubmit.value = response.id
      editModeAfterSubmit.value = true
    }
  }
})

const onExport = async () => {
  await exportItem({
    model: 'climate',
    modelId: props.item.id,
    detail: {
      success: 'Klimacheck erfolgreich exportiert',
      error: 'Fehler beim Exportieren des Klimachecks'
    }
  })
}
</script>

<style scoped>
.p-invalid {
  @apply border-red-600 text-red-600;
}

.p-error {
  @apply text-red-600;
}
</style>
