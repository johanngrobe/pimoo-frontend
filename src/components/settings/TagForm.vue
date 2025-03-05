<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-12 gap-x-2 items-center">
      <div class="col-span-11">
        <FloatLabel variant="on">
          <InputText id="label" v-model="newTag.label" class="w-full" required="true" />
          <label for="label">Tag eingeben</label>
        </FloatLabel>
      </div>
      <div class="col-span-1 flex justify-center items-center">
        <ButtonSave type="submit" color="green" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import ButtonSave from '@/components/ui/ButtonSave.vue'
import FloatLabel from 'primevue/floatlabel'

const newTag = ref({
  label: ''
})

const resetNewTag = () => {
  newTag.value.label = ''
}

const emit = defineEmits(['add-item'])

const onSubmit = async () => {
  emit('add-item', newTag.value)
  resetNewTag()
}
</script>

<style></style>
