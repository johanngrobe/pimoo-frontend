<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div
        v-for="(mainObjective, index) in mobilityStore.mobilityObjectiveForm"
        :key="index"
        class="mt-7"
      >
        <div class="flex items-center">
          <Checkbox
            class="flex-none"
            :id="`checkbox-${index}`"
            :key="`checkbox-${index}`"
            v-model="mainObjective.target"
            :binary="true"
          />
          <label :for="`checkbox-${index}`" class="text-lg ms-3" @click="toggleCheckbox(index)">
            <div class="flex justify-center">
              <span class="font-bold flex-none my-auto">{{ mainObjective.no }}</span>
              <span class="text-semibold ms-2 flex-auto my-auto">{{ mainObjective.label }}</span>
            </div>
          </label>
        </div>
        <div v-if="mainObjective.target" class="ms-5 mt-5">
          <MobilitySubObjectiveForm :mainObjectiveIndex="index" />
        </div>
        <div
          v-if="index < mobilityStore.mobilityObjectiveForm.length - 1"
          class="border-b-2 mt-7"
        ></div>
      </div>
    </form>
  </div>
</template>

<script setup>
import Checkbox from 'primevue/checkbox'
import MobilitySubObjectiveForm from '@/components/form/MobilitySubObjectiveForm.vue'
import { useMobilitySubmissionStore } from '@/stores/mobilitySubmission'

const mobilityStore = useMobilitySubmissionStore()

const toggleCheckbox = (index) => {
  mobilityStore.mobilityObjectiveForm[index].target =
    !mobilityStore.mobilityObjectiveForm[index].target
}
</script>

<style scoped></style>
