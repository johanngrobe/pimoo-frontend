<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-12 gap-x-2">
      <div class="col-span-11">
        <div class="flex w-full">
          <FloatLabel variant="on">
            <InputNumber
              id="mainObjective"
              v-model="newMainObjective.no"
              class="w-16 me-2"
              inputClass="w-16"
              :min="1"
              :step="1"
              required="true"
            />
            <label for="mainObjective">#</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-full">
            <InputText
              id="label"
              v-model="newMainObjective.label"
              class="w-full"
              inputClass="w-full"
              required="true"
            />
            <label for="label">Neues Leitziel eingeben</label>
          </FloatLabel>
        </div>
      </div>
      <div class="col-span-1">
        <ButtonSave type="submit" color="green" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const newMainObjective = ref({
  label: '',
  no: null
})

const resetNewMainObjective = () => {
  newMainObjective.value = {
    label: '',
    no: null
  }
}

const emit = defineEmits(['add-item'])

const onSubmit = async () => {
  emit('add-item', newMainObjective.value)
  resetNewMainObjective()
}
</script>

<style></style>
