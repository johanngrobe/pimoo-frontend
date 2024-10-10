<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div
        v-for="(mainObjective, index) in mobilityStore.mobilityObjectiveForm"
        :key="index"
        class="mt-7"
      >
        <div class="flex items-center border p-2 rounded-lg" @click="toggleCheckbox(index)">
          <Checkbox
            class="flex-none"
            :id="`checkbox-${index}`"
            :key="`checkbox-${index}`"
            v-model="mainObjective.target"
            :binary="true"
            @click="toggleCheckbox(index)"
          />
          <label :for="`checkbox-${index}`" class="text-lg ms-3">
            <div class="flex justify-center">
              <span class="font-bold flex-none my-auto">{{ mainObjective.mainObjective.no }}</span>
              <span class="font-bold ms-2 flex-auto my-auto">{{
                mainObjective.mainObjective.label
              }}</span>
            </div>
          </label>
        </div>
        <div v-if="mainObjective.target" class="ms-5 mt-5">
          <MobilitySubObjectiveForm :mainObjectiveIndex="index" />
        </div>
        <div
          v-if="index < mobilityStore.mobilityObjectiveForm.length - 1"
          class="border-b-4 mt-7"
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
