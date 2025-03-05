<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-12 gap-x-2">
      <div class="col-span-10 grid grid-cols-1 gap-3">
        <FloatLabel variant="on">
          <InputText id="label" v-model="newIndicator.label" class="w-full" required="true" />
          <label for="label">Indikator-Bezeichnung</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="sourceUrl" v-model.trim="newIndicator.sourceUrl" class="w-full" />
          <label for="sourceUrl">Quellen-URL</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <MultiSelect
            id="tags"
            v-model="newIndicator.tagIds"
            :options="props.tags"
            option-label="label"
            option-value="id"
            display="chip"
            class="w-full"
          />
          <label for="tags">Tags auswählen</label>
        </FloatLabel>
      </div>
      <div class="col-span-2 flex justify-center items-center">
        <ButtonSave type="submit" color="green" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import FloatLabel from 'primevue/floatlabel'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  tags: Array
})

const newIndicator = ref({
  label: '',
  tagIds: [],
  sourceUrl: null
})

const resetnewIndicator = () => {
  newIndicator.value = {
    label: '',
    tagIds: []
  }
}

const emit = defineEmits(['add-item'])

const onSubmit = async () => {
  emit('add-item', newIndicator.value)
  resetnewIndicator()
}
</script>

<style></style>
