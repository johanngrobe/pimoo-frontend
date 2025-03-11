<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 gap-2">
      <div class="grid grid-cols-1 gap-3">
        <div class="w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText id="label" v-model="label" class="w-full" :invalid="!!errors.label" />
            <label for="label">Indikator-Bezeichnung</label>
          </FloatLabel>
          <small v-if="errors.label" id="label-help" class="p-error block">{{
            errors.label
          }}</small>
        </div>
        <div class="w-full">
          <FloatLabel variant="on" class="w-full">
            <InputText
              id="sourceUrl"
              v-model.trim="sourceUrl"
              class="w-full"
              :invalid="!!errors.sourceUrl"
            />
            <label for="sourceUrl">Quellen-URL</label>
          </FloatLabel>
          <small v-if="errors.sourceUrl" id="sourceUrl-help" class="p-error block">{{
            errors.sourceUrl
          }}</small>
        </div>
        <FloatLabel variant="on">
          <MultiSelect
            id="tags"
            v-model="tagIds"
            :options="props.tags"
            option-label="label"
            option-value="id"
            display="chip"
            class="w-full"
          />
          <label for="tags">Tags auswählen</label>
        </FloatLabel>
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
import { schema } from '@/utils/schemas/indicator'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  editMode: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    default: null
  },
  tags: Array
})

const { defineField, handleSubmit, errors, setValues } = useForm({
  validationSchema: schema
})

const [label] = defineField('label')
const [sourceUrl] = defineField('sourceUrl')
const [tagIds] = defineField('tagIds')

onMounted(() => {
  if (props.editMode) {
    setValues({
      label: props.item.label,
      tagIds: props.item.tagIds,
      sourceUrl: props.item.sourceUrl
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
