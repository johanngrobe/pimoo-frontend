<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-2">
      <div>
        <FloatLabel variant="on">
          <InputText id="label" v-model="label" class="w-full" :invalid="!!errors.no" />
          <label for="label">Textblock eingeben</label>
        </FloatLabel>
        <small v-if="errors.label" id="label-help" class="p-error block">{{ errors.label }}</small>
      </div>
      <div>
        <FloatLabel variant="on">
          <MultiSelect
            id="tags"
            v-model="tagIds"
            :options="props.tags"
            option-label="label"
            option-value="id"
            display="chip"
            class="w-full"
            :invalid="!!errors.label"
          />
          <label for="label">Tags auswählen</label>
        </FloatLabel>
        <small v-if="errors.label" id="label-help" class="p-error block">{{ errors.label }}</small>
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
import { schema } from '@/utils/schemas/textBlock'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    required: true
  },
  item: Object,
  tags: Array
})

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: schema
})

const [label] = defineField('label')
const [tagIds] = defineField('tagIds')

onMounted(() => {
  if (props.editMode) {
    setValues({
      label: props.item.label,
      tagIds: props.item.tagIds
    })
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
