<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-2">
      <div class="flex gap-2 font-bold p-1">
        <span>Leitziel:</span>
        <span>{{ props.mainObjective.no }}</span
        ><span>{{ props.mainObjective.label }}</span>
      </div>
      <div class="flex gap-2">
        <div>
          <FloatLabel variant="on">
            <InputNumber
              id="no"
              v-model="no"
              class="w-16"
              inputClass="w-16"
              locale="de-DE"
              :min="1"
              :step="1"
              required="true"
            />
            <label for="no">#</label>
          </FloatLabel>
          <small v-if="errors.no" id="no-help" class="p-error block">{{ errors.no }}</small>
        </div>
        <div class="w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText id="label" v-model="label" class="w-full" required="true" />
            <label for="label">Unterziel eingeben</label>
          </FloatLabel>
          <small v-if="errors.label" id="label-help" class="p-error block">{{
            errors.label
          }}</small>
        </div>
      </div>
      <div class="flex justify-end items-center">
        <ButtonSave type="submit" color="green">Speichern</ButtonSave>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { schema } from '@/utils/schemas/subObjective'
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
  mainObjectiveId: {
    type: Number,
    default: null
  },
  mainObjective: {
    type: Object,
    default: null
  },
  nextNo: {
    type: Number,
    default: null
  }
})

const { defineField, handleSubmit, errors, setValues, setFieldValue } = useForm({
  validationSchema: schema
})

const [no] = defineField('no')
const [label] = defineField('label')

onMounted(() => {
  if (props.editMode) {
    setValues({
      mainObjectiveId: props.mainObjectiveId,
      no: props.item.no,
      label: props.item.label
    })
  } else {
    setFieldValue('mainObjectiveId', props.mainObjectiveId)
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
