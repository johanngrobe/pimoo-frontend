<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-12 gap-x-2">
      <div class="col-span-10 grid grid-cols-1 gap-4">
        <FloatLabel variant="on">
          <InputText id="label" v-model="newTextBlock.label" class="w-full" required="true" />
          <label for="label">Textblock eingeben</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <MultiSelect
            id="tags"
            v-model="newTextBlock.tagIds"
            :options="props.tags"
            option-label="label"
            option-value="id"
            display="chip"
            class="w-full mt-2"
          />
          <label for="label">Tags auswählen</label>
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
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  tags: Array
})

const newTextBlock = ref({
  label: '',
  tagIds: []
})

const resetNewTextBlock = () => {
  newTextBlock.value = {
    label: '',
    tagIds: []
  }
}

const emit = defineEmits(['add-item'])

const onSubmit = async () => {
  emit('add-item', newTextBlock.value)
  resetNewTextBlock()
}
</script>

<style></style>
