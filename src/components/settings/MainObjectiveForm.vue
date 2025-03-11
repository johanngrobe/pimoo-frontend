<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-2">
      <div class="flex w-full">
        <div>
          <FloatLabel variant="on">
            <InputNumber
              id="mainObjective"
              v-model="no"
              class="w-16 me-2"
              inputClass="w-16"
              :invalid="!!errors.no"
              :min="1"
              :step="1"
            />
            <label for="mainObjective">#</label>
          </FloatLabel>
          <small v-if="errors.no" id="no-help" class="p-error block">{{ errors.no }}</small>
        </div>
        <div class="w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText
              id="label"
              v-model="label"
              class="w-full"
              inputClass="w-full"
              :invalid="!!errors.label"
            />
            <label for="label">Leitziel eingeben</label>
          </FloatLabel>
          <small v-if="errors.label" id="label-help" class="p-error block">{{
            errors.label
          }}</small>
        </div>
      </div>
      <div class="flex justify-end">
        <ButtonSave type="submit" color="green">Speichern</ButtonSave>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/mainObjective'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  item: Object,
  nextNo: {
    type: Number,
    default: null
  }
})

const { defineField, handleSubmit, errors, setValues, setFieldValue } = useForm({
  validationSchema: schema
})

// Define form state
const [no] = defineField('no')
const [label] = defineField('label')

onMounted(() => {
  if (props.editMode) {
    setValues({
      no: props.item.no,
      label: props.item.label
    })
  } else {
    setFieldValue('no', props.nextNo)
  }
})

const emit = defineEmits(['add-item', 'update-item'])

const onSubmit = handleSubmit(async (values) => {
  if (props.editMode) {
    emit('update-item', { modelId: props.item.id, values })
  } else {
    emit('add-item', values)
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
