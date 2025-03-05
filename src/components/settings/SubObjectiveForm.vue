<template>
  <form @submit.prevent="onSubmit">
    <div class="grid grid-cols-12 gap-x-2">
      <div class="col-span-11">
        <div class="flex gap-2">
          <FloatLabel variant="on">
            <Select
              v-model="newSubObjective.mainObjective"
              :options="props.mainObjectives"
              optionLabel="label"
              class="w-24"
              id="mainObjectiveId"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.no }}</div>
                </div>
              </template>
              <template #option="slotProps">
                <div class="flex items-center align-items-center gap-2">
                  <span>{{ slotProps.option.no }}</span>
                  <span>{{ slotProps.option.label }}</span>
                </div>
              </template>
            </Select>
            <label for="mainObjectiveId">Leitziel</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputNumber
              id="no"
              v-model="newSubObjective.no"
              class="w-16"
              inputClass="w-16"
              locale="de-DE"
              :min="1"
              :step="1"
              required="true"
            />
            <label for="no">#</label>
          </FloatLabel>
          <FloatLabel variant="on" class="w-full">
            <InputText id="label" v-model="newSubObjective.label" class="w-full" required="true" />
            <label for="label">Indikator eingeben</label>
          </FloatLabel>
        </div>
      </div>
      <div class="col-span-1 flex justify-center items-center">
        <ButtonSave type="submit" color="green" />
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import ButtonSave from '@/components/ui/ButtonSave.vue'

const props = defineProps({
  mainObjectives: Array
})

const newSubObjective = ref({
  label: '',
  no: null,
  mainObjectiveId: null,
  mainObjective: {}
})

newSubObjective.value.mainObjectiveId = computed(() => {
  return newSubObjective.value?.mainObjective?.id || null
})

const resetNewSubObjective = () => {
  newSubObjective.value = {
    label: '',
    no: null,
    mainObjectiveId: null,
    mainObjective: null
  }
}

const emit = defineEmits(['add-item'])

const onSubmit = async () => {
  emit('add-item', newSubObjective.value)
  resetNewSubObjective()
}
</script>

<style></style>
